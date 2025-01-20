from datetime import datetime

import neomodel


class NeomodelConnectionTest(neomodel.StructuredNode):
    __primarykey__ = "name"
    name = neomodel.StringProperty(unique_index=True)

    # Add a created_at timestamp field
    created_at = neomodel.DateTimeProperty(default=datetime.now)
