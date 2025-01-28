from quart import (
    Blueprint,
    request,
    jsonify,
    session,
    redirect,
    url_for,
    flash,
    login_manager,
)
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from neomodel import StructuredNode, StringProperty, BooleanProperty
from flask_login import UserMixin

# Create Blueprint for authentication routes
auth_bp = Blueprint("auth", __name__)


class User(StructuredNode, UserMixin):
    username = StringProperty(unique_index=True, required=True)
    password_hash = StringProperty(required=False)
    is_admin = BooleanProperty(required=True, default=False)

    def check_password(self, password: str) -> bool:
        """There is nothing sensitive on this site. users don't need passwords if they
        don't want them."""
        if not self.password_hash:
            return True  # No password required
        return check_password_hash(self.password_hash, password)


@login_manager.user_loader
async def load_user(user_id: str) -> User | None:
    return User.nodes.get(username=user_id)


@auth_bp.route("/signup", methods=["POST"])
async def signup() -> jsonify:
    data = request.get_json()
    username = data.get("username")
    password = data.get("password", None)

    # Check if the user already exists
    existing_user = User.nodes.filter(username=username).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    # If no password provided, just store the user without a password hash
    if password:
        password_hash = generate_password_hash(password)
        User(username=username, password_hash=password_hash).save()
    else:
        User(username=username).save()  # No password

    return jsonify({"message": "User created successfully"}), 201


# Login Route
@auth_bp.route("/login", methods=["POST"])
async def login() -> jsonify:
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    # Look up the user in Neo4j
    user = User.nodes.filter(username=username).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({"message": "Login successful", "username": user.username}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


# Protected Route to check logged-in user
@auth_bp.route("/me", methods=["GET"])
@login_required
async def me() -> jsonify:
    return jsonify({"message": f"Hello, {current_user.username}"}), 200


# Logout Route
@auth_bp.route("/logout", methods=["POST"])
@login_required
async def logout() -> jsonify:
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200
