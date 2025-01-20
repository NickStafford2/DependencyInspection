# Requirements

# Notes
- Javascript frameworks are going out of style at an alarming rate. I suggest we write a program uses react, instead of a react app that has some of our code
- Todo: lets write everything. know exactly what we want and what it needs. 

# Open questions
- How do we want to manage state? 
  - Frontend: 
    - Only node and edge data is saved on backend. The backend does nothing except send the requested data data to frontend
    - Send all nodes and edges to frontend, and let the frontend do analysis.
    - Saves server from computing
    - Not good for users with slow computers
  - Both: have a copy of state on frontend and backend. Both sides do differnt things
    - Duplicated work, but allows both frontend and backend to specialize on what they do.
  - Backend
    - Frontend just recieves data and displays it. 
    - Frontend needs to control how data is visualized. 
    - Backend tools do all the analysis, 
      - Python graph analysis tools should be better 
    - Requires more ajax requests. 
      - May need to send new network to frontend every time data is changed



# Frontend
- For each package searched, show a graph of dependencies as well as useful analytics

## Search
- Use user input to search for project ego network. (dependencies)

## Graph
- Show graph of the ego network
  - Central node should be visually distinct
### Visualization
- User should be able to: 
  - Move around 
  - Zoom in and out 
- Adjust graph canvas/svg to fit screen
- Focus on a specific node

### Graph Display Customization
- Highlight nodes based on user search
    - Highlight connected nodes
- Have a sidebar that allows users to control Graph
  - Filter out nodes they don't care about.
- Highlight/Filter out nodes with propertiese they are interested in.
  - Depreciated packages
  - Packages with known security vulnerabilities. 
  - Packages with keywords

## Analytics
- Chart which packages are used most in network
- Identify central nodes in the network.
- Clustering and community detection
  - Identify what sort of package it is. 

## Large Graph
- have an alternate tab for searching much larger graphs. 
- top 100 most used dependencies on npm. 


# Backend

## Package Data to save
- Name
- current version
- Dependencies
- Use description to save important keywords describing what the package does

## DB
- Save important information for each package as nodes
- Save all dependency information as edges

## Scraping
- If package.json is not saved already, download it from the web and save important information into the db.

## File Cashing 
- Save each package.json data along with a timestamp of when it was last updated. 
