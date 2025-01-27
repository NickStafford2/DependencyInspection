#!/bin/zsh

# Function to run curl and display simplified output
test_url() {
    url=$1
    echo -n "Testing $url: "
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")  # -s for silent, -o /dev/null to discard body, -w to show HTTP code
    if [[ $response -eq 200 ]]; then
        echo "Success ($response)"
    elif [[ $response -eq 301 ]]; then
        echo "Redirected ($response)"
    elif [[ $response -eq 404 ]]; then
        echo "Not Found ($response)"
    elif [[ $response -eq 7 ]]; then
        echo "Connection Failed ($response)"
    elif [[ $response -eq 60 ]]; then
        echo "SSL Certificate Error ($response)"
    else
        echo "Error: HTTP Code $response"
    fi
}

# Test various URLs with both http and https
test_url http://localhost
test_url http://localhost:8080
test_url http://localhost:80
# test_url http://localhost:433
# test_url https://localhost -k  # Use -k to bypass SSL issues
# test_url https://localhost:8080 -k
# test_url https://localhost:80 -k
# test_url https://localhost:433 -k
