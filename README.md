# Smart CAPTAR Front-end
## Overview
Smart captar is an addition application to the prexisting cable management tool. The purpose of this application is to provide a straightforward cable upload process while providing cable QA checks and project management. 
## Prerequisites

 - Install latest Version of Node.js
 - Clone the project

## Running the Application
### Front End: React
Start in root folder and run the following commands
`npm install`
`npm start`
Open application on LocalHost:3000 

## Framework: React
React is a free and open source front end javascript library developed by Meta. 
Source: https://react.dev/

## Key Dependencies

* @json2csv/plainjs
* axios
* flatlist-react
* lottie-react
* npm
* papaparse
* react
* react-dom
* react-modal
* react-papaparse
* react-router-dom


## Pages
### AllCableHistory
Components Used
* Profile
* Navigation
* CableInventoryView

### ApprovalQueue
Components Used
* Profile
* Navigation
* CableInventoryView

Purpose:
Approval Queue page that shows the cables a user can approve
### ApprovedCables
Components Used
* Profile
* Navigation
* CableInventoryView

Purpose:
Shows all cables that have been approved descending by date
### CableHistory
Components Used
* Profile
* Navigation
* CableInventoryView

Purpose:
Shows the user the version history of a cable
### CableInventory
Components Used
* Profile
* Navigation
* CableInventoryView

Purpose:
Shows users the cables stored in CABLEINV the target table for approved cables
### CreateNew
Components Used
* Profile
* Navigation
* CreateNewCables
* Loading
* Success

Purpose:
Bulk upload page for users to use CAPTARIN files for uploading cable data
### Dashboard
Components Used
* Profile
* Navigation
* RejectedTableView
* PendingTableView

Purpose:
Dashboard page to show users their pending and rejected cables
### Login
Purpose:
Login Page
### Settings
Components Used
* Profile
* Navigation
* SettingsTableView
* ProjectsTableView
* CompatibilityTableView

Purpose:
ADMIN Settings page for updating users, projects, and compatibility
### UploadedCables
Components Used
* Profile
* Navigation
* CableInventoryView

Purpose:
Workspace page for users to edit and submit cable data

## Components
### Animations
Props
* none

Purpose:
Timed animations for users
### CableInventoryView
Props
* User: slac username
* Target table to fetch cables from
* cable: load information for a single cable

Description:
Depending on the props being passed, the table component will fetch rows from the correct target table or a single cable in the history table. Each row in the table is also its own component being generated in TableCableRow. Each row renders its own headers, modals, buttons etc. 
#### TableCableRow
Props
* cables: json of cable data
* headers: The headers that need to be displayed
* setCables: state function to reset the state when the user updates a cable
* openModalView: state to open modals for each cable
* table: the table being used to fetch cables
* cable: then cable being selected in the modal
* user: the slac issued username

Description
Renders each row for each cable it is being passed. The required headers needed for this component to work is the CABLENUM, STATUS, CABLETYPE, CONNECTORTYPE and user. When a user selects a cable to edit, the cable information is stored in a state then the modal is opened. 

### CreateNewCables
Props
* cables: json of cable data
* headers: The headers that need to be displayed
* setCables: state function to reset the state when the user updates a cable
* table: the table being used to fetch cables
* cable: then cable being selected in the modal
* user: the slac issued username

Description
Similar component to TableCableRow but is used for the bulk upload table. Each cable is rendered and QA checked for issues. If an issue is found a warning sign is posted next to the cable number.

### FilterBar
Props
* searchInventory: function for searching the inventory with the search term
* table: table being used to fetch cables
* setSearch: state that holds user input in the search box
* setFilter: sets the state for which dropdown the user chooses
* filterTerm: state that holds which dropdown option the user selects to filter
* name: Changes the filter bar based on the table it is pulling cables from. Workspace, CABLEINV, Inventory, Queue
### CompatibilityManager
Props
* none

Description
Table editor for the SMARTCAPTAR_COMPATIBILITY table in oracle. This component is shown on the settings page for the ADMIN account. 
### ProjectManager
Props
* none

Description
Table editor for the SMARTCAPTAR_PROJECTS table in oracle. This component is shown on the settings page for the ADMIN account. 
### UserManager
Props
* none

Description
Table editor for the SMARTCAPTAR_USERS table in oracle. This component is shown on the settings page for the ADMIN account. 
### Modals
*  CableHistoryModal
*   CableInventoryModal
*  CableWorkspaceModal
*   ConfirmationModal
*   CreateCableModal
*   FileUploadModal
*   ModalView

Description
Each modal is used within the CableInventoryView Component. Each modal is passed the state to close and open the modal. The cable being showin in the modal. Any functions related to the cable such as Updating, Reverting, Deleting, Approving, Filtering

### Navigation
Props
* None

Description
Left side navigation bar that is shown for all users
### Pending Cables
Props
* user: slac issued username

Description
Table view of a users pending cables
### Profile
Props
* user: slac issued username

Description
Top profile bar displayed on every page
### RejectedCables
Props
* user: slac issued username

Description
Table view of a users rejected cables



