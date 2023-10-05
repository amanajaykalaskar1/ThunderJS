function Preq() {
  // prerequisite dictionary
  var services = {
    "DeviceInfo": {
      "api": "Controller.1.activate",
      "input": { "callsign": "DeviceInfo" }
    },
    "WebKitBrowser": {
      "api": "Controller.1.activate",
      "input": { "callsign": "WebKitBrowser" }
    },
    "UserPreferences": {
      "api": "Controller.1.activate",
      "input": { "callsign": "org.rdk.UserPreferences" }
    },
    "Warehouse": {
      "api": "Controller.1.activate",
      "input": { "callsign": "org.rdk.Warehouse" }
    },
    "DisplaySettings": {
      "api": "Controller.1.activate",
      "input": { "callsign": "org.rdk.DisplaySettings" }
    },
    "PlayerInfo": {
      "api": "Controller.1.activate",
      "input": { "callsign": "PlayerInfo" }
    },
    "System": {
      "api": "Controller.1.activate",
      "input": { "callsign": "System" }
    },
    "Timer": {
      "api": "Controller.1.activate",
      "input": { "callsign": "Timer" }
    }

  }
  return services
}

