# Dependency Inspection

![Sample Force Graph](/docs/screenshots/screenshot2?raw=true "Dependency Network of NPM and Express")

A simple tool that inspects your project's dependencies, and identifies vulnerabilities and risks that could arise from them. <a href="www.dependencyinspection.com">Check it out.</a>

Creates a 3D force graph of popular NPM packages for easy inspection. Data is scraped from various sources such as the npm registry, OBV.com, and ClearlyDefined. 

The goal is to identify packages that are not well maintained, but are heavily relied on by massive companies. It would also be nice to find packages that are heavily relied on that have unusual licences. Rugpull threat assessment is undergoing active development. 

# Still in Development
I still have a ton of work to do. I will be adding better data sources over the coming weeks. 

# Data Sources:
- <a href="https://google.github.io/osv.dev/data/#converted-data">Open Source Vulnerabilities (OBS)</a>

![Web Page](/docs/screenshots/screenshot1?raw=true)
Created by Nicholas Stafford
