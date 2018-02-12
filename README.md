
# starter-module
Please use as base site for new site modules.

# Engagement Lab Web Suite module starter kit
### Setup
1. Install [EL-Website](https://github.com/engagementgamelab/EL-Website).
2. Clone this repo (https://github.com/engagementgamelab/starter-module.git).
3. Link this module to EL-Website: 

  ```
  cd repo-name
  npm-link
  ```
  
  ```
  cd ../EL-Website
  npm link repo-name
  ```
  
4. Start the module. **From EL-Website**, run:

  ```
  grunt --sites=repo-name
  ```
The site should now be running at http://localhost:3000.

(More docs coming soon.)