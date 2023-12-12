
# Computing 2 Coursework Submission.
**CID**: *******

**PLEASE NPM INSTALL THANK YOU :)**
EmpireGrid is a turn-based strategy multiplayer game, set in a world where players build, upgrade, and wage wars against each other to establish their empires. The game is designed to be played on a grid, with players taking turns to make decisions and strategize their moves.
Once in game, you may prefer to use the keyboard controls that are available.

There are some jslint problems but fixing them I found bought too many bugs into the code.
launch.json
```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Run Web App – Firefox",
            "type": "firefox",
            "request": "launch",
            "reAttach": true,
            "reloadOnAttach": true,
            "file": "${workspaceFolder}/web-app/index.html",
            "preferences": {
                "security.fileuri.strict_origin_policy": false
            },
            "skipFiles": [
                "${workspaceFolder}/node_modules/**",
                "<node_internals>/**"
            ]
        },
        {
            "name": "Debug Module",
            "type": "node",
            "request": "launch",
            "skipFiles": [
                "${workspaceFolder}/node_modules/**",
                "<node_internals>/**"
            ],
            // You'll need to change this line below to point to your module.
            "program": "${workspaceFolder}/web-app/Game_module.js"
        },
        {
            "name": "Generate Docs",
            "command": "jsdoc -c jsdoc.json; exit",
            "request": "launch",
            "type": "node-terminal"
        }
    ]
}

```
