from dependencyinspection._models.dependency import Dependency
from dependencyinspection._models.neomodel_connection_test import NeomodelConnectionTest
from dependencyinspection._models.ns_pretty_printable import NSPrettyPrintable

# from dependencyinspection._models.package import Package
from dependencyinspection._models.package import Package, PackageData
from dependencyinspection._models.packument import Packument

"""
This exists to resolve circular imports. Import from this file instead of dependencyinspection/_models/

This is an implementation of the interface pattern. 

"""
