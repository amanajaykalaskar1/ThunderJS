//event notifications

//to check the connection event
thunderJS.on('connect', () => {
  console.log('Device Connected!!!')
  heartbeat = true
})
thunderJS.on('disconnect', () => {
  console.log('Device Disconnected!!!')
  heartbeat = false
})


//Displaysettings Resolution changed
thunderJS.on('org.rdk.DisplaySettings', 'resolutionChanged', notification => {
  const { width, height, videoDisplayType, resolution } = notification
  console.log('<<resolutionChanged  event>>' + JSON.stringify(notification))
  console.log('Width:', width)
  console.log('Height:', height)
  console.log('Video Display Type:', videoDisplayType)
  console.log('Resolution:', resolution)
  eventDict['resolutionChanged'] = notification
})

//DisplaySettiang vdeo format changed
thunderJS.on('org.rdk.DisplaySettings', 'videoFormatChanged', notification => {
  const { supportedVideoFormat, currentVideoFormat } = notification
  console.log('<<videoFormatChanged  event>>' + JSON.stringify(notification))
  console.log('supportedVideoFormat:', supportedVideoFormat)
  console.log('currentVideoFormat:', currentVideoFormat)
  eventDict['videoFormatChanged'] = notification
})

//set zoom setting
thunderJS.on('org.rdk.DisplaySettings', 'zoomSettingUpdated', notification => {
  const { zoomSetting, videoDisplayType } = notification
  console.log('<<zoomSettingUpdated  event>>' + JSON.stringify(notification))
  console.log('zoomSetting:', zoomSetting)
  console.log('videoDisplayType', videoDisplayType)
  eventDict['zoomSettingUpdated'] = notification
})

//set preresolutionchanged
thunderJS.on('org.rdk.DisplaySettings', 'resolutionPreChange', notification => {
  const { resolution } = notification
  console.log('<<resolutionPreChange  event>>' + JSON.stringify(notification))
  console.log('Resolution:', resolution)
  eventDict['resolutionPreChange'] = notification
})


//set warehouse reset_Device
thunderJS.on('org.rdk.Warehouse', 'resetDone', notification => {
  const { } = notification
  console.log('<<resetDone  event>>' + JSON.stringify(notification))
  eventDict['resetDone'] = notification
})
//get Playerinfo dolby_audiomodechanged
thunderJS.on('PlayerInfo', 'dolby_audiomodechanged', notification => {
  const { mode, enable } = notification
  console.log('<<dolby_audiomodechanged  event>>' + JSON.stringify(notification))
  console.log('mode:', mode)
  console.log('enable:', enable)
  eventDict['dolby_audiomodechanged'] = notification
})
//get System onMacAddressesRetreived
thunderJS.on('org.rdk.System', 'onMacAddressesRetreived', notification => {
  const {  } = notification
  console.log('<<onMacAddressesRetreived  event>>' + JSON.stringify(notification))
  eventDict['onMacAddressesRetreived'] = notification
})


//get System onNetworkStandbyModeChanged
thunderJS.on('org.rdk.System', 'onNetworkStandbyModeChanged', notification => {
  const {  } = notification
  console.log('<<onNetworkStandbyModeChanged  event>>' + JSON.stringify(notification))
  eventDict['onNetworkStandbyModeChanged'] = notification
})

// //set warehouse reset_Device
// thunderJS.on('PlayerInfo', 'statechange', notification => {
//   const { STATE, CALLSIGN, REASON } = notification
//   console.log('<<statechange  event>>' + JSON.stringify(notification))
//   console.log('STATE:', STATE)
//   console.log('CALLSIGN', CALLSIGN)
//   console.log('REASON', REASON)
//   eventDict['statechange'] = notification
// })

/////Webkit events:-

//get webkit loadfinished
thunderJS.on('WebKitBrowser', 'loadfinished', notification => {
  const { url, httpstatus } = notification
  console.log('<<loadfinished  event>>' + JSON.stringify(notification))
  console.log('url:', url)
  console.log('httpstatus:', httpstatus)
  eventDict['loadfinished'] = notification
})

//get webkit visibilitychange
thunderJS.on('WebKitBrowser', 'visibilitychange', notification => {
  const { hidden } = notification
  console.log('<<visibilitychange  event>>' + JSON.stringify(notification))
  console.log('hidden:', hidden)
  eventDict['visibilitychange'] = notification
})

//get webkit loadfailed
thunderJS.on('WebKitBrowser', 'loadfailed', notification => {
  const { url } = notification
  console.log('<<loadfailed  event>>' + JSON.stringify(notification))
  console.log('url:', url)
  eventDict['loadfailed'] = notification
})

//get webkit urlchange
thunderJS.on('WebKitBrowser', 'urlchange', notification => {
  const { url, loaded } = notification
  console.log('<<urlchange  event>>' + JSON.stringify(notification))
  console.log('url:', url)
  console.log('loaded:', loaded)
  eventDict['urlchange'] = notification
})

//get webkit statechange
thunderJS.on('WebKitBrowser', 'statechange', notification => {
  const { suspended } = notification
  console.log('<<statechange  event>>' + JSON.stringify(notification))
  console.log('suspended:', suspended)
  eventDict['statechange'] = notification
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
