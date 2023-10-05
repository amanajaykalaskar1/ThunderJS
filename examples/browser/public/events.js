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

//get System onSystemPowerStateChanged
thunderJS.on('org.rdk.System', 'onSystemPowerStateChanged', notification => {
  const { powerState, currentPowerState } = notification
  console.log('<<onSystemPowerStateChanged  event>>' + JSON.stringify(notification))
  console.log('powerState:', powerState)
  console.log('currentPowerState:', currentPowerState)
  eventDict['onSystemPowerStateChanged'] = notification
})

//get System onMacAddressesRetreived
thunderJS.on('org.rdk.System', 'onMacAddressesRetreived', notification => {
  const { ecm_mac, estb_mac, moca_mac, eth_mac, wifi_mac, bluetooth_mac, rf4ce_mac, info, success } = notification
  console.log('<<onMacAddressesRetreived  event>>' + JSON.stringify(notification))
  console.log('ecm_mac:', ecm_mac)
  console.log('estb_mac:', estb_mac)
  console.log('moca_mac:', moca_mac)
  console.log('eth_mac:', eth_mac)
  console.log('wifi_mac:', wifi_mac)
  console.log('bluetooth_mac:', bluetooth_mac)
  console.log('rf4ce_mac:', rf4ce_mac)
  console.log('info:', info)
  console.log('success:', success)
  eventDict['onMacAddressesRetreived'] = notification
})

//get System onSystemModeChanged
thunderJS.on('org.rdk.System', 'onSystemModeChanged', notification => {
  const { mode } = notification
  console.log('<<onSystemModeChanged  event>>' + JSON.stringify(notification))
  console.log('mode:', mode)
  eventDict['onSystemModeChanged'] = notification
})

//get System onRebootRequest
thunderJS.on('org.rdk.System', 'onRebootRequest', notification => {
  const { requestedApp, rebootReason } = notification
  console.log('<<onRebootRequest  event>>' + JSON.stringify(notification))
  console.log('requestedApp:', requestedApp)
  console.log('rebootReason:', rebootReason)
  eventDict['onRebootRequest'] = notification
})

//get System onNetworkStandbyModeChanged
thunderJS.on('org.rdk.System', 'onNetworkStandbyModeChanged', notification => {
  const { nwStandby } = notification
  console.log('<<onNetworkStandbyModeChanged  event>>' + JSON.stringify(notification))
  console.log('nwStandby:', nwStandby)
  eventDict['onNetworkStandbyModeChanged'] = notification
})

//get Timer timerExpired
thunderJS.on('org.rdk.Timer', 'timerExpired', notification => {
  const { timerId, mode, status } = notification
  console.log('<<timerExpired  event>>' + JSON.stringify(notification))
  console.log('timerId:', timerId)
  console.log('mode:', mode)
  console.log('status:', status)
  eventDict['timerExpired'] = notification
})

//get Timer timerExpiryReminder
thunderJS.on('org.rdk.Timer', 'timerExpiryReminder', notification => {
  const { timerId, mode, timeRemaining } = notification
  console.log('<<timerExpiryReminder  event>>' + JSON.stringify(notification))
  console.log('timerId:', timerId)
  console.log('mode:', mode)
  console.log('timeRemaining:', timeRemaining)
  eventDict['timerExpiryReminder'] = notification
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
