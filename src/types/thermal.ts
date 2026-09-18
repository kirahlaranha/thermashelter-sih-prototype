export type ScenarioId = 'baseline' | 'improved' | 'optimized'

export interface HourlyPoint {
  timestampUTC: string
  timestampIST: string
  outdoorC: number
  freeIndoorC: number
  freeIndoorMinC: number
  freeIndoorMaxC: number
  idealIndoorC: number
  idealHeatingKW: number
  idealHeatingEnergyKWh: number
  windowSolarGainKW: number
}

export interface Scenario {
  id: ScenarioId
  name: string
  label: string
  configuration: {
    primaryGlazedFacadeAzimuthDeg: number
    oppositeGlazedFacadeAzimuthDeg: number
    windowAreaM2: number
    windowDistributionM2: { primaryFacade: number; oppositeFacade: number }
    wallInsulationMm: number
    roofInsulationMm: number
    floorInsulationMm: number
    windowUValueWm2K: number
    shgc: number
    infiltrationACH: number
    opaqueSolarAbsorptance: number
    wallUValueWm2K: number
    roofUValueWm2K: number
    floorUValueWm2K: number
    wallArealHeatCapacityKJm2K: number
    roofArealHeatCapacityKJm2K: number
    floorArealHeatCapacityKJm2K: number
  }
  freeRunning: {
    minIndoorTempC: number
    maxIndoorTempC: number
    meanIndoorTempC: number
    hoursInTargetBand: number
    coldDegreeHoursKh: number
    hotDegreeHoursKh: number
  }
  idealHeating: {
    heatingEnergyKWh: number
    peakHeatingKW: number
    heatingEnergyPerM2KWhM2: number
    heatFlow72h: {
      lossesKWhPositiveMagnitude: Record<'walls' | 'roof' | 'floor' | 'windows' | 'infiltration', number>
      gainsKWh: { solarGain: number; internalGain: number }
    }
  }
  headlineHeatFlow72h: {
    basis: string
    lossesKWh: Record<'walls' | 'roof' | 'floor' | 'windows' | 'infiltration', number>
    gainsKWh: { solar: number; internal: number }
  }
  hourlySeries: HourlyPoint[]
  explanation: string[]
}

export interface ThermalDataset {
  project: {
    problemStatementId: string
    organization: string
    title: string
    prototypeMode: string
  }
  location: {
    name: string
    latitudeDeg: number
    longitudeDeg: number
    referenceElevationM: number
    simulationTimeBasis: string
    displayTimeBasis: string
  }
  weather: {
    source: string
    reported72h: {
      startUTC: string
      endUTCInclusiveHour: string
      outdoorMinC: number
      outdoorMaxC: number
      outdoorMeanC: number
      meanSitePressureKPa: number
      minSitePressureKPa: number
      maxSitePressureKPa: number
      sumHourlyGHI_kWh_m2: number
    }
  }
  geometry: {
    lengthM: number
    widthM: number
    heightM: number
    floorAreaM2: number
    roofAreaM2: number
    volumeM3: number
    grossWallAreaM2: number
    netOpaqueWallAreaM2: number
    totalWindowAreaM2: number
    floorBoundary: string
  }
  scenarios: Scenario[]
  comparison: {
    improvedVsBaseline: Record<string, number>
    optimizedVsBaseline: {
      heatingEnergyReductionPct: number
      peakHeatingLoadReductionPct: number
      coldDegreeHourReductionPct: number
      increaseHoursInTargetBand: number
      minimumFreeRunningTempChangeC: number
      envelopeAndInfiltrationLossReductionPct: number
      windowSolarGainChangePct: number
    }
    orientationOnlyDiagnostic: {
      method: string
      eastPrimaryWindowSolarKWh: number
      southPrimaryWindowSolarKWh: number
      windowSolarGainIncreaseSouthVsEastKWh: number
      windowSolarGainIncreaseSouthVsEastPct: number
      eastOrientationHeatingEnergyKWh: number
      southOrientationHeatingEnergyKWh: number
      heatingEnergyReductionFromSouthOrientationPct: number
      freeRunningMeanTempIncreaseSouthVsEastC: number
      freeRunningColdDegreeHourReductionSouthVsEastPct: number
    }
  }
  modelDisclosure: string
}
