"use strict";

const miceGrid = document.getElementById("miceGrid");
const exposureRateSlider = document.getElementById("exposureRateSlider");
const exposureRateValue = document.getElementById("exposureRateValue");
const exposureDurationSlider = document.getElementById(
  "exposureDurationSlider",
);
const exposureDurationValue = document.getElementById(
  "exposureDurationValue",
);
const totalQuantitySlider = document.getElementById("totalQuantitySlider");
const totalQuantityValue = document.getElementById("totalQuantityValue");
const totalQuantityNote = document.getElementById("totalQuantityNote");
const formulaRate = document.getElementById("formulaRate");
const formulaDuration = document.getElementById("formulaDuration");
const formulaTotal = document.getElementById("formulaTotal");
const fullscreenButton = document.getElementById("fullscreenButton");
const irradiationButton = document.getElementById("irradiationButton");
const noExposureButton = document.getElementById("noExposureButton");
const phaseStatus = document.getElementById("phaseStatus");
const exposureProgressValue = document.getElementById(
  "exposureProgressValue",
);
const exposureProgressTrack = document.getElementById(
  "exposureProgressTrack",
);
const exposureProgressFill = document.getElementById("exposureProgressFill");
const accumulatedQuantityValue = document.getElementById(
  "accumulatedQuantityValue",
);
const followupTimeValue = document.getElementById("followupTimeValue");
const radiationEffects = document.getElementById("radiationEffects");
const radiationSource = document.getElementById("radiationSource");
const sourceState = document.getElementById("sourceState");
const sourceStateText = document.getElementById("sourceStateText");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const chartGrid = document.getElementById("chartGrid");
const chartTicks = document.getElementById("chartTicks");
const experimentCurves = document.getElementById("experimentCurves");
const impactChart = document.getElementById("impactChart");
const impactArea = document.getElementById("impactArea");
const impactPath = document.getElementById("impactPath");
const impactHitPath = document.getElementById("impactHitPath");
const impactMarker = document.getElementById("impactMarker");
const experimentCurveHoverMarker = document.getElementById(
  "experimentCurveHoverMarker",
);
const timeDisplay = document.getElementById("timeDisplay");
const survivorsDisplay = document.getElementById("survivorsDisplay");
const totalQuantityDisplay = document.getElementById("totalQuantityDisplay");
const chartTooltip = document.getElementById("chartTooltip");
const saveExperimentBtn = document.getElementById("saveExperimentBtn");
const newExperimentBtn = document.getElementById("newExperimentBtn");
const noExposureConfirmDialog = document.getElementById(
  "noExposureConfirmDialog",
);
const newExperimentConfirmDialog = document.getElementById(
  "newExperimentConfirmDialog",
);
const clearExperimentsBtn = document.getElementById("clearExperimentsBtn");
const experimentLegend = document.getElementById("experimentLegend");
const experimentsTableBody = document.getElementById("experimentsTableBody");
const equivalentExperimentsNotice = document.getElementById(
  "equivalentExperimentsNotice",
);
const equivalentExperimentsContent = document.getElementById(
  "equivalentExperimentsContent",
);

const TOTAL_MICE = 100;
const MAX_MONTHS = 24;
const DAYS_PER_MONTH = 30;
const MAX_DAYS = Math.round(MAX_MONTHS * DAYS_PER_MONTH);
const TIME_STEP_DAYS = 10;
const PLAYBACK_DAY_STEP = TIME_STEP_DAYS;
const PLAYBACK_INTERVAL_MS = 140;
const RATE_LEVELS = [
  { level: 1, label: "Χαμηλός", value: 1 },
  { level: 2, label: "Μέτριος", value: 2 },
  { level: 3, label: "Υψηλός", value: 4 },
];
const DURATION_LEVELS = [
  { level: 1, label: "Μικρός", value: 1 },
  { level: 2, label: "Μεσαίος", value: 2 },
  { level: 3, label: "Μεγάλος", value: 4 },
];
const EXPOSURE_COMBINATIONS = new Map([
  ["1|1", { step: 1, label: "Μικρή", totalQuantity: 0.01 }],
  ["1|2", { step: 2, label: "Μικρή προς Μεσαία", totalQuantity: 1 }],
  ["1|3", { step: 3, label: "Μεσαία", totalQuantity: 2.5 }],
  ["2|1", { step: 2, label: "Μικρή προς Μεσαία", totalQuantity: 1 }],
  ["2|2", { step: 4, label: "Μεσαία", totalQuantity: 3.5 }],
  ["2|3", { step: 5, label: "Μεσαία προς Μεγάλη", totalQuantity: 4.5 }],
  ["3|1", { step: 3, label: "Μεσαία", totalQuantity: 2.5 }],
  ["3|2", { step: 5, label: "Μεσαία προς Μεγάλη", totalQuantity: 4.5 }],
  ["3|3", { step: 6, label: "Μεγάλη", totalQuantity: 10 }],
]);
const TOTAL_QUANTITY_NOTES = {
  Μικρή: "(Ποσότητα που αντιστοιχεί σε διαγνωστικές εξετάσεις)",
  Μεγάλη:
    "(Ποσότητα που αντιστοιχεί σε πυρηνικά ατυχήματα στους άμεσα εκτεθειμένους)",
};
const EXPERIMENT_COLORS = [
  "#63c7ff",
  "#ff8c9a",
  "#8ce99a",
  "#ffd166",
  "#b69cff",
  "#5eead4",
];
const EXPERIMENT_DASH_PATTERNS = ["", "10 6", "3 5", "14 5 3 5"];
const HAZARD_PARAMS = {
  a: 0.0016664,
  b: 0.00000287,
  c: 0.003,
  k: 5,
  L: 2,
  A: 0.05,
  m: 8,
  D_th: 5,
  k_d: 12,
  L_d: 0.3,
  immediateKillK: 1.2,
  immediateKillD50: 18,
};
const CHART = {
  left: 88,
  right: 748,
  top: 36,
  bottom: 448,
};

const simulationState = {
  phase: "setup",
  exposure: {
    rateLevel: 2,
    rateLabel: "Μέτριος",
    rate: 2,
    durationLevel: 2,
    durationLabel: "Μεσαίος",
    duration: 2,
    totalQuantityLevel: 5,
    totalQuantityLabel: "Μεσαία",
    totalQuantity: 3.5,
  },
  appliedTotalQuantity: 0,
  exposureEvents: [],
  currentDay: 0,
  exposureElapsed: 0,
  accumulatedQuantity: 0,
  exposureStartedAt: null,
  exposureTimerId: null,
  isPlaying: false,
  timerId: null,
  series: [],
  mouseCells: [],
  deadMouseIndices: new Set(),
  mouseMotionTimers: [],
  experiments: [],
  selectedExperimentId: null,
  nextExperimentId: 1,
  currentExperimentSaved: false,
  currentSavedExperimentId: null,
};

function syncFullscreenButton() {
  if (!fullscreenButton) {
    return;
  }

  const isFullscreen = Boolean(document.fullscreenElement);
  const label = isFullscreen
    ? "Έξοδος από πλήρη οθόνη"
    : "Πλήρης οθόνη";

  fullscreenButton.classList.toggle("is-fullscreen", isFullscreen);
  fullscreenButton.setAttribute("aria-pressed", String(isFullscreen));
  fullscreenButton.setAttribute("aria-label", label);
  fullscreenButton.title = label;
}

if (fullscreenButton) {
  fullscreenButton.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error("Η λειτουργία πλήρους οθόνης δεν είναι διαθέσιμη.", error);
    }
  });

  document.addEventListener("fullscreenchange", syncFullscreenButton);
  syncFullscreenButton();
}

function getLevelOption(options, level) {
  return options.find((option) => option.level === level) ?? options[1];
}

function getExposureCombination(rateLevel, durationLevel) {
  return (
    EXPOSURE_COMBINATIONS.get(`${rateLevel}|${durationLevel}`) ??
    EXPOSURE_COMBINATIONS.get("2|2")
  );
}

function cancelExposureTimer() {
  if (simulationState.exposureTimerId !== null) {
    window.clearInterval(simulationState.exposureTimerId);
    simulationState.exposureTimerId = null;
  }
}

function setSourceActive(isActive) {
  sourceState?.classList.toggle("source-state-on", isActive);
  radiationSource?.classList.toggle("is-active", isActive);

  if (sourceStateText) {
    sourceStateText.textContent = isActive
      ? "Πηγή ενεργή"
      : "Πηγή ανενεργή";
  }
}

function setTimelineControlsForPhase(isExposing, isFollowup) {
  if (playBtn) {
    playBtn.disabled = isExposing;
  }

  [pauseBtn, backBtn, nextBtn].forEach((button) => {
    if (button) {
      button.disabled = !isFollowup;
    }
  });
}

function renderExperimentPhase() {
  const { duration, durationLabel, totalQuantity, totalQuantityLabel } =
    simulationState.exposure;
  const isSetup = simulationState.phase === "setup";
  const isExposing = simulationState.phase === "exposing";
  const isFollowup = simulationState.phase === "followup";
  const isNoExposure = isFollowup && totalQuantity === 0;
  const progress = isNoExposure
    ? 0
    : isFollowup
      ? 1
      : Math.min(1, simulationState.exposureElapsed / duration);

  if (exposureRateSlider) {
    exposureRateSlider.disabled = !isSetup;
  }

  if (exposureDurationSlider) {
    exposureDurationSlider.disabled = !isSetup;
  }

  if (irradiationButton) {
    irradiationButton.disabled = !isSetup;
    irradiationButton.textContent = isSetup
      ? "Έναρξη έκθεσης"
      : isExposing
        ? "Η έκθεση βρίσκεται σε εξέλιξη…"
        : isNoExposure
          ? "Δεν πραγματοποιήθηκε έκθεση"
          : "Η έκθεση ολοκληρώθηκε";
  }

  if (noExposureButton) {
    noExposureButton.disabled = !isSetup;
  }

  if (newExperimentBtn) {
    newExperimentBtn.disabled = !isFollowup;
  }

  if (saveExperimentBtn) {
    saveExperimentBtn.disabled =
      !isFollowup || simulationState.currentExperimentSaved;
    saveExperimentBtn.textContent = simulationState.currentExperimentSaved
      ? "Το πείραμα αποθηκεύτηκε"
      : "Αποθήκευση πειράματος";
  }

  if (restartBtn) {
    restartBtn.disabled = isSetup;
    const restartLabel = isExposing
      ? "Ακύρωση έκθεσης"
      : "Επιστροφή στην αρχή της παρακολούθησης";
    restartBtn.setAttribute("aria-label", restartLabel);
    restartBtn.title = restartLabel;
  }

  if (phaseStatus) {
    phaseStatus.textContent = isSetup
      ? "Έτοιμο για έκθεση"
      : isExposing
        ? "Έκθεση σε εξέλιξη"
        : isNoExposure
          ? "Παρακολούθηση χωρίς έκθεση"
          : "Παρακολούθηση μετά την έκθεση";
  }

  if (exposureProgressValue) {
    exposureProgressValue.textContent = isSetup
      ? `${durationLabel} χρόνος`
      : isExposing
        ? "Σε εξέλιξη"
        : isNoExposure
          ? "Καθόλου"
          : "Ολοκληρώθηκε";
  }

  if (accumulatedQuantityValue) {
    accumulatedQuantityValue.textContent = isSetup
      ? "Δεν έχει ξεκινήσει"
      : isExposing
        ? "Σε συσσώρευση"
        : isNoExposure
          ? "Καθόλου"
          : `${totalQuantityLabel} ποσότητα`;
  }

  if (exposureProgressFill) {
    exposureProgressFill.style.width = `${(progress * 100).toFixed(1)}%`;
  }

  if (exposureProgressTrack) {
    exposureProgressTrack.setAttribute(
      "aria-valuenow",
      String(Math.round(progress * 100)),
    );
  }

  if (followupTimeValue) {
    followupTimeValue.textContent = isFollowup
      ? `${simulationState.currentDay} ημέρες`
      : "Δεν έχει ξεκινήσει";
  }

  setTimelineControlsForPhase(isExposing, isFollowup);
  setSourceActive(isExposing);
}

function getExposureIntensity(totalQuantity) {
  return Math.min(Math.max(totalQuantity / 30, 0), 1);
}

function dayToMonth(day) {
  return day / DAYS_PER_MONTH;
}

function monthToX(month) {
  return CHART.left + (month / MAX_MONTHS) * (CHART.right - CHART.left);
}

function xToMonth(x) {
  const clampedX = Math.min(CHART.right, Math.max(CHART.left, x));
  return ((clampedX - CHART.left) / (CHART.right - CHART.left)) * MAX_MONTHS;
}

function countToY(count) {
  return CHART.bottom - (count / TOTAL_MICE) * (CHART.bottom - CHART.top);
}

function logistic(value) {
  return 1 / (1 + Math.exp(-value));
}

function getExposureStatsUpToMonth(month, exposureEvents) {
  let totalQuantity = 0;
  let lastExposureMonth = null;
  let thresholdCrossMonth = null;

  exposureEvents
    .filter((event) => dayToMonth(event.timeDay) <= month)
    .sort((left, right) => left.timeDay - right.timeDay)
    .forEach((event) => {
      const eventMonth = dayToMonth(event.timeDay);
      totalQuantity += event.totalQuantity;
      lastExposureMonth = eventMonth;

      if (
        thresholdCrossMonth === null &&
        totalQuantity >= HAZARD_PARAMS.D_th
      ) {
        thresholdCrossMonth = eventMonth;
      }
    });

  return {
    totalQuantity,
    lastExposureMonth,
    thresholdCrossMonth,
  };
}

function deterministicHazard(month, exposureStats) {
  const { A, m, D_th, k_d, L_d } = HAZARD_PARAMS;
  const { totalQuantity, lastExposureMonth, thresholdCrossMonth } =
    exposureStats;

  if (lastExposureMonth === null) {
    return 0;
  }

  const activationMonth =
    thresholdCrossMonth !== null ? thresholdCrossMonth : lastExposureMonth;
  const quantityGate = logistic(m * (totalQuantity - D_th));
  const timeGate = logistic(k_d * (month - activationMonth - L_d));

  return A * quantityGate * timeGate;
}

function immediateKillFraction(totalQuantity) {
  const { immediateKillK, immediateKillD50 } = HAZARD_PARAMS;
  return logistic(immediateKillK * (totalQuantity - immediateKillD50));
}

function immediateDeathsUpToMonth(month, exposureEvents) {
  let survivors = TOTAL_MICE;

  exposureEvents
    .filter((event) => dayToMonth(event.timeDay) <= month)
    .sort((left, right) => left.timeDay - right.timeDay)
    .forEach((event) => {
      const deathsNow = survivors * immediateKillFraction(
        event.totalQuantity,
      );
      survivors -= deathsNow;
    });

  return TOTAL_MICE - survivors;
}

function totalHazard(month, exposureEvents) {
  const { a, b, c, k, L } = HAZARD_PARAMS;
  const exposureStats = getExposureStatsUpToMonth(month, exposureEvents);
  const exposureContribution = exposureEvents.reduce((sum, event) => {
    const eventMonth = dayToMonth(event.timeDay);

    if (eventMonth > month) {
      return sum;
    }

    return (
      sum +
      (c * event.totalQuantity) /
        (1 + Math.exp(-k * (month - eventMonth - L)))
    );
  }, 0);

  return (
    a +
    b * month +
    exposureContribution +
    deterministicHazard(month, exposureStats)
  );
}

function integrateHazard(tDay, exposureEvents, dtDays = TIME_STEP_DAYS) {
  let integral = 0;

  for (let uDay = 0; uDay < tDay; uDay += dtDays) {
    integral +=
      totalHazard(dayToMonth(uDay), exposureEvents) *
      (dtDays / DAYS_PER_MONTH);
  }

  return integral;
}

function estimatedDeaths(tDay, exposureEvents) {
  const tMonth = dayToMonth(tDay);
  const immediateDeaths = immediateDeathsUpToMonth(tMonth, exposureEvents);
  const survivorsAfterImmediate = TOTAL_MICE - immediateDeaths;
  const H = integrateHazard(tDay, exposureEvents);
  const delayedDeaths = survivorsAfterImmediate * (1 - Math.exp(-H));

  return Math.min(TOTAL_MICE, immediateDeaths + delayedDeaths);
}

function recomputeAppliedQuantity() {
  simulationState.appliedTotalQuantity = simulationState.exposureEvents.reduce(
    (sum, event) => sum + event.totalQuantity,
    0,
  );
}

function buildSeries(exposureEvents) {
  const data = [{ day: 0, month: 0, affected: 0, surviving: TOTAL_MICE }];

  for (let day = TIME_STEP_DAYS; day <= MAX_DAYS; day += TIME_STEP_DAYS) {
    const affected = Math.min(
      TOTAL_MICE,
      estimatedDeaths(day, exposureEvents),
    );

    data.push({
      day,
      month: dayToMonth(day),
      affected,
      surviving: Math.max(0, TOTAL_MICE - affected),
    });
  }

  return data;
}

function createSvgNode(tagName, attributes) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tagName);

  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, String(value));
  });

  return node;
}

function buildCurvePath(points) {
  if (points.length === 0) {
    return "";
  }

  return `M ${points.join(" L ")}`;
}

function getChartPointerPosition(event) {
  if (!impactChart) {
    return { x: 0, y: 0 };
  }

  const rect = impactChart.getBoundingClientRect();
  const scaleX = rect.width > 0 ? 800 / rect.width : 1;
  const scaleY = rect.height > 0 ? 520 / rect.height : 1;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function getNearestSeriesPoint(series, chartX) {
  if (!series || series.length === 0) {
    return null;
  }

  const approximateDay =
    Math.round((xToMonth(chartX) * DAYS_PER_MONTH) / TIME_STEP_DAYS) *
    TIME_STEP_DAYS;
  const clampedDay = Math.min(MAX_DAYS, Math.max(0, approximateDay));

  return (
    series.find((point) => point.day === clampedDay) ??
    series[series.length - 1] ??
    null
  );
}

function formatTooltipHtml(point, experiment = null) {
  const experimentLine = experiment
    ? experiment.totalQuantity === 0
      ? `<strong>Πείραμα ${experiment.id}</strong><br>Χωρίς έκθεση<br>`
      : `<strong>Πείραμα ${experiment.id}</strong><br>${experiment.rateLabel} ρυθμός × ${experiment.durationLabel} χρόνος → ${experiment.totalQuantityLabel} ποσότητα<br>`
    : "";

  return `${experimentLine}t μετά την έκθεση = ${point.day} ημέρες (${point.month.toFixed(1)} μήνες)<br>Επιζώντα ποντίκια = ${Math.round(point.surviving)}`;
}

function showExperimentCurveMarker(point, color = "#63c7ff") {
  if (!experimentCurveHoverMarker || !point) {
    return;
  }

  experimentCurveHoverMarker.setAttribute("cx", monthToX(point.month));
  experimentCurveHoverMarker.setAttribute("cy", countToY(point.surviving));
  experimentCurveHoverMarker.setAttribute("stroke", color);
  experimentCurveHoverMarker.setAttribute("r", "6");
}

function hideExperimentCurveMarker() {
  if (!experimentCurveHoverMarker) {
    return;
  }

  experimentCurveHoverMarker.setAttribute("r", "0");
}

function renderExperimentCurves() {
  if (!experimentCurves) {
    return;
  }

  experimentCurves.innerHTML = "";
  hideExperimentCurveMarker();

  const orderedExperiments = [...simulationState.experiments].sort(
    (left, right) => {
      if (left.id === simulationState.selectedExperimentId) {
        return 1;
      }

      if (right.id === simulationState.selectedExperimentId) {
        return -1;
      }

      return left.id - right.id;
    },
  );

  orderedExperiments.forEach((experiment) => {
    const isSelected = experiment.id === simulationState.selectedExperimentId;
    const isDimmed =
      simulationState.selectedExperimentId !== null && !isSelected;
    const path = createSvgNode("path", {
      class: `chart-experiment-path${isSelected ? " is-selected" : ""}`,
      d: experiment.pathData,
      stroke: experiment.color,
      "stroke-dasharray": experiment.dashPattern || "none",
      "stroke-width": isSelected ? 3.8 : 2.4,
      opacity: isDimmed ? 0.24 : 0.88,
    });
    const hitPath = createSvgNode("path", {
      class: "chart-experiment-hit",
      d: experiment.pathData,
      "data-experiment-id": experiment.id,
    });

    hitPath.addEventListener("mouseenter", (event) => {
      const pointer = getChartPointerPosition(event);
      const point = getNearestSeriesPoint(experiment.series, pointer.x);

      if (!point) {
        return;
      }

      showExperimentCurveMarker(point, experiment.color);
      showChartTooltip(event, point, experiment);
    });
    hitPath.addEventListener("mousemove", (event) => {
      const pointer = getChartPointerPosition(event);
      const point = getNearestSeriesPoint(experiment.series, pointer.x);

      if (!point) {
        return;
      }

      showExperimentCurveMarker(point, experiment.color);
      moveChartTooltip(event, point, experiment);
    });
    hitPath.addEventListener("mouseleave", () => {
      hideExperimentCurveMarker();
      hideChartTooltip();
    });
    hitPath.addEventListener("click", () => {
      selectExperiment(experiment.id);
    });

    experimentCurves.appendChild(path);
    experimentCurves.appendChild(hitPath);
  });
}

function selectExperiment(experimentId) {
  if (
    !simulationState.experiments.some(
      (experiment) => experiment.id === experimentId,
    )
  ) {
    return;
  }

  simulationState.selectedExperimentId = experimentId;
  renderExperimentCurves();
  renderExperimentComparison();
  renderExperimentPhase();
}

function deleteExperiment(experimentId) {
  simulationState.experiments = simulationState.experiments.filter(
    (experiment) => experiment.id !== experimentId,
  );

  if (simulationState.selectedExperimentId === experimentId) {
    simulationState.selectedExperimentId =
      simulationState.experiments.at(-1)?.id ?? null;
  }

  if (simulationState.currentSavedExperimentId === experimentId) {
    simulationState.currentExperimentSaved = false;
    simulationState.currentSavedExperimentId = null;
  }

  renderExperimentCurves();
  renderExperimentComparison();
  renderExperimentPhase();
}

function getEquivalentExperimentGroups(experiments) {
  const groupsByQuantity = new Map();

  experiments.forEach((experiment) => {
    const quantityKey = String(experiment.totalQuantity);
    const group = groupsByQuantity.get(quantityKey) ?? [];
    group.push(experiment);
    groupsByQuantity.set(quantityKey, group);
  });

  return [...groupsByQuantity.values()].filter((group) => {
    if (group.length < 2) {
      return false;
    }

    const combinations = new Set(
      group.map(
        (experiment) =>
          `${experiment.rateLevel}|${experiment.durationLevel}`,
      ),
    );

    return combinations.size > 1;
  });
}

function renderEquivalentExperiments(groups) {
  if (!equivalentExperimentsNotice || !equivalentExperimentsContent) {
    return;
  }

  equivalentExperimentsNotice.hidden = groups.length === 0;

  if (groups.length === 0) {
    equivalentExperimentsContent.innerHTML = "";
    return;
  }

  equivalentExperimentsContent.innerHTML = `
    <p>
      Τα παρακάτω πειράματα έχουν διαφορετικό ρυθμό και χρόνο έκθεσης,
      αλλά ίδια συνολική ποσότητα. Στο εκπαιδευτικό μοντέλο οι καμπύλες
      τους συμπίπτουν.
    </p>
    <ul class="equivalent-experiments-list">
      ${groups
        .map((group) => {
          const equations = group
            .map(
              (experiment) =>
                `Πείραμα ${experiment.id}: ${experiment.rateLabel} ρυθμός × ${experiment.durationLabel} χρόνος`,
            )
            .join(" · ");

          return `<li>${equations} → ${group[0].totalQuantityLabel} ποσότητα</li>`;
        })
        .join("")}
    </ul>
  `;
}

function renderExperimentComparison() {
  const experiments = simulationState.experiments;
  const equivalentGroups = getEquivalentExperimentGroups(experiments);
  const equivalentExperimentIds = new Set(
    equivalentGroups.flatMap((group) =>
      group.map((experiment) => experiment.id),
    ),
  );

  if (clearExperimentsBtn) {
    clearExperimentsBtn.disabled = experiments.length === 0;
  }

  renderEquivalentExperiments(equivalentGroups);

  if (experimentLegend) {
    if (experiments.length === 0) {
      experimentLegend.innerHTML =
        '<span class="experiment-legend-empty">Δεν υπάρχουν αποθηκευμένα πειράματα.</span>';
    } else {
      experimentLegend.innerHTML = experiments
        .map((experiment) => {
          const isSelected =
            experiment.id === simulationState.selectedExperimentId;

          return `
            <button
              type="button"
              class="experiment-legend-button${isSelected ? " is-selected" : ""}"
              data-select-experiment="${experiment.id}"
              aria-pressed="${isSelected}"
              style="--experiment-color: ${experiment.color}"
            >
              <span class="experiment-color-swatch" aria-hidden="true"></span>
              Πείραμα ${experiment.id}
            </button>
          `;
        })
        .join("");
    }
  }

  if (experimentsTableBody) {
    if (experiments.length === 0) {
      experimentsTableBody.innerHTML = `
        <tr class="experiments-empty-row">
          <td colspan="5">Αποθηκεύστε ένα πείραμα για να ξεκινήσει η σύγκριση.</td>
        </tr>
      `;
    } else {
      experimentsTableBody.innerHTML = experiments
        .map((experiment) => {
          const isSelected =
            experiment.id === simulationState.selectedExperimentId;

          return `
            <tr class="experiment-table-row${isSelected ? " is-selected" : ""}">
              <td>
                <button
                  type="button"
                  class="experiment-select-button"
                  data-select-experiment="${experiment.id}"
                  style="--experiment-color: ${experiment.color}"
                >
                  <span class="experiment-color-swatch" aria-hidden="true"></span>
                  Πείραμα ${experiment.id}
                </button>
              </td>
              <td>${experiment.rateLabel}</td>
              <td>${experiment.durationLabel}</td>
              <td>
                ${experiment.totalQuantityLabel}
                ${
                  equivalentExperimentIds.has(experiment.id)
                    ? '<span class="equivalent-badge">ίδια ποσότητα</span>'
                    : ""
                }
              </td>
              <td>
                <button
                  type="button"
                  class="experiment-delete-button"
                  data-delete-experiment="${experiment.id}"
                  aria-label="Διαγραφή πειράματος ${experiment.id}"
                >
                  Διαγραφή
                </button>
              </td>
            </tr>
          `;
        })
        .join("");
    }
  }

  document.querySelectorAll("[data-select-experiment]").forEach((button) => {
    button.addEventListener("click", () => {
      selectExperiment(Number(button.dataset.selectExperiment));
    });
  });

  document.querySelectorAll("[data-delete-experiment]").forEach((button) => {
    button.addEventListener("click", () => {
      deleteExperiment(Number(button.dataset.deleteExperiment));
    });
  });
}

function randomSample(items, count) {
  const pool = [...items];
  const selected = [];

  for (let i = 0; i < count && pool.length > 0; i += 1) {
    const pickIndex = Math.floor(Math.random() * pool.length);
    selected.push(pool[pickIndex]);
    pool.splice(pickIndex, 1);
  }

  return selected;
}

function setMouseCellState(index, isDead) {
  const cell = simulationState.mouseCells[index];

  if (!cell) {
    return;
  }

  cell.src = isDead ? "images/mouse_dead_64.png" : "images/mouse_64.png";
  cell.dataset.state = isDead ? "dead" : "alive";
  cell.classList.toggle("mouse-dead", isDead);
  cell.classList.toggle("mouse-alive", !isDead);
  cell.classList.remove("is-twitching");
}

function scheduleMouseMotion(index) {
  const cell = simulationState.mouseCells[index];

  if (!cell) {
    return;
  }

  const delay = 700 + Math.random() * 2400;

  simulationState.mouseMotionTimers[index] = window.setTimeout(() => {
    if (!cell || cell.dataset.state !== "alive") {
      scheduleMouseMotion(index);
      return;
    }

    const angle = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()) * 2;
    cell.style.setProperty("--mouse-twitch-angle", `${angle.toFixed(2)}deg`);
    cell.classList.remove("is-twitching");
    void cell.offsetWidth;
    cell.classList.add("is-twitching");

    window.setTimeout(() => {
      cell.classList.remove("is-twitching");
    }, 240);

    scheduleMouseMotion(index);
  }, delay);
}

function syncMouseDeaths(targetDeaths) {
  const desiredDeaths = Math.max(0, Math.min(TOTAL_MICE, targetDeaths));
  const currentDeaths = simulationState.deadMouseIndices.size;

  if (
    desiredDeaths === currentDeaths ||
    simulationState.mouseCells.length === 0
  ) {
    return;
  }

  if (desiredDeaths > currentDeaths) {
    const aliveIndices = simulationState.mouseCells
      .map((_, index) => index)
      .filter((index) => !simulationState.deadMouseIndices.has(index));
    const toKill = randomSample(aliveIndices, desiredDeaths - currentDeaths);

    toKill.forEach((index) => {
      simulationState.deadMouseIndices.add(index);
      setMouseCellState(index, true);
    });

    return;
  }

  const deadIndices = [...simulationState.deadMouseIndices];
  const toRevive = randomSample(deadIndices, currentDeaths - desiredDeaths);

  toRevive.forEach((index) => {
    simulationState.deadMouseIndices.delete(index);
    setMouseCellState(index, false);
  });
}

function showChartTooltip(event, point, experiment = null) {
  if (!chartTooltip) {
    return;
  }

  const pointer = getChartPointerPosition(event);

  chartTooltip.hidden = false;
  chartTooltip.innerHTML = formatTooltipHtml(point, experiment);
  chartTooltip.dataset.side = point.month > 18 ? "left" : "right";
  chartTooltip.style.left =
    point.month > 18 ? `${pointer.x - 170}px` : `${pointer.x + 14}px`;
  chartTooltip.style.top = `${pointer.y - 14}px`;
}

function moveChartTooltip(event, point, experiment = null) {
  if (!chartTooltip || chartTooltip.hidden) {
    return;
  }

  const pointer = getChartPointerPosition(event);
  chartTooltip.innerHTML = formatTooltipHtml(point, experiment);
  const showLeft = point.month > 18;
  chartTooltip.dataset.side = showLeft ? "left" : "right";
  chartTooltip.style.left = showLeft
    ? `${pointer.x - 170}px`
    : `${pointer.x + 14}px`;
  chartTooltip.style.top = `${pointer.y - 14}px`;
}

function hideChartTooltip() {
  if (!chartTooltip) {
    return;
  }

  chartTooltip.hidden = true;
}

function getCurrentCurvePoint(event) {
  const visibleSeries = simulationState.series.filter(
    (point) => point.day <= simulationState.currentDay,
  );
  const pointer = getChartPointerPosition(event);
  return getNearestSeriesPoint(visibleSeries, pointer.x);
}

function renderChartFrame(dayValue) {
  if (
    !impactArea ||
    !impactPath ||
    !impactHitPath ||
    !impactMarker ||
    !timeDisplay ||
    !survivorsDisplay ||
    !totalQuantityDisplay
  ) {
    return;
  }

  const visibleData = simulationState.series.filter(
    (point) => point.day <= dayValue,
  );
  const points = visibleData.map(
    (point) => `${monthToX(point.month)},${countToY(point.surviving)}`,
  );
  const linePath = buildCurvePath(points);
  const areaPath =
    points.length > 0
      ? `${linePath} L ${monthToX(visibleData[visibleData.length - 1].month)},${CHART.bottom} L ${monthToX(visibleData[0].month)},${CHART.bottom} Z`
      : "";
  const currentPoint = visibleData[visibleData.length - 1] ?? {
    day: 0,
    month: 0,
    affected: 0,
    surviving: TOTAL_MICE,
  };

  const showCurrentCurve = simulationState.phase === "followup";

  impactPath.setAttribute("d", showCurrentCurve ? linePath : "");
  impactHitPath.setAttribute("d", showCurrentCurve ? linePath : "");
  impactArea.setAttribute("d", showCurrentCurve ? areaPath : "");
  impactMarker.setAttribute("cx", monthToX(currentPoint.month));
  impactMarker.setAttribute("cy", countToY(currentPoint.surviving));
  impactMarker.setAttribute("r", showCurrentCurve ? "7" : "0");
  hideExperimentCurveMarker();

  if (simulationState.phase === "followup") {
    timeDisplay.textContent = `t μετά την έκθεση = ${currentPoint.day} ημέρες (${currentPoint.month.toFixed(1)} μήνες)`;
    survivorsDisplay.textContent = `Επιζώντα = ${Math.round(currentPoint.surviving)}`;
    totalQuantityDisplay.textContent = `Ποσότητα = ${simulationState.exposure.totalQuantityLabel}`;
  } else {
    timeDisplay.textContent = "t μετά την έκθεση = —";
    survivorsDisplay.textContent = "Επιζώντα = 100";
    totalQuantityDisplay.textContent = "Ποσότητα = —";
  }

  syncMouseDeaths(Math.round(currentPoint.affected));
  renderExperimentCurves();
}

function initializeChartSkeleton() {
  if (!chartGrid || !chartTicks) {
    return;
  }

  chartGrid.innerHTML = "";
  chartTicks.innerHTML = "";

  [0, 25, 50, 75, 100].forEach((count) => {
    const y = countToY(count);
    const gridLine = createSvgNode("line", {
      class: "chart-grid-line",
      x1: CHART.left,
      y1: y,
      x2: CHART.right,
      y2: y,
    });
    const tickLine = createSvgNode("line", {
      class: "chart-tick-line",
      x1: CHART.left - 8,
      y1: y,
      x2: CHART.left,
      y2: y,
    });
    const tickText = createSvgNode("text", {
      class: "chart-tick-text",
      x: CHART.left - 18,
      y: y + 5,
      "text-anchor": "end",
    });

    tickText.textContent = String(count);
    chartGrid.appendChild(gridLine);
    chartTicks.appendChild(tickLine);
    chartTicks.appendChild(tickText);
  });

  [0, 6, 12, 18, 24].forEach((month) => {
    const x = monthToX(month);
    const tickLine = createSvgNode("line", {
      class: "chart-tick-line",
      x1: x,
      y1: CHART.bottom,
      x2: x,
      y2: CHART.bottom + 8,
    });
    const tickText = createSvgNode("text", {
      class: "chart-tick-text",
      x,
      y: CHART.bottom + 28,
      "text-anchor": "middle",
    });

    tickText.textContent = String(month);
    chartTicks.appendChild(tickLine);
    chartTicks.appendChild(tickText);
  });
}

function rebuildSimulation() {
  recomputeAppliedQuantity();
  simulationState.series = buildSeries(simulationState.exposureEvents);
  renderChartFrame(simulationState.currentDay);
}

function stepTimeline(direction) {
  if (simulationState.phase !== "followup") {
    return;
  }

  stopPlayback();
  simulationState.currentDay = Math.min(
    MAX_DAYS,
    Math.max(0, simulationState.currentDay + direction * TIME_STEP_DAYS),
  );
  renderChartFrame(simulationState.currentDay);
  renderExperimentPhase();
}

function stopPlayback() {
  simulationState.isPlaying = false;

  if (simulationState.timerId !== null) {
    window.clearInterval(simulationState.timerId);
    simulationState.timerId = null;
  }
}

function startPlayback() {
  if (
    simulationState.phase !== "followup" ||
    simulationState.isPlaying
  ) {
    return;
  }

  if (simulationState.currentDay >= MAX_DAYS) {
    simulationState.currentDay = 0;
    renderChartFrame(simulationState.currentDay);
  }

  simulationState.isPlaying = true;
  simulationState.timerId = window.setInterval(() => {
    if (simulationState.currentDay >= MAX_DAYS) {
      stopPlayback();
      return;
    }

    simulationState.currentDay += PLAYBACK_DAY_STEP;
    renderChartFrame(simulationState.currentDay);
    renderExperimentPhase();
  }, PLAYBACK_INTERVAL_MS);
}

function buildRadiationEffect(totalQuantity) {
  if (!radiationEffects || !miceGrid) {
    return;
  }

  const intensity = getExposureIntensity(totalQuantity);
  const rayCount = 8 + Math.round(intensity * 18);
  const waveCount = 2 + Math.round(intensity * 3);

  radiationEffects.innerHTML = "";
  radiationEffects.style.setProperty(
    "--exposure-intensity",
    intensity.toFixed(3),
  );
  miceGrid.style.setProperty("--exposure-intensity", intensity.toFixed(3));

  for (let i = 0; i < rayCount; i += 1) {
    const ray = document.createElement("span");
    const spread = -34 + (68 / Math.max(rayCount - 1, 1)) * i;
    const jitter = (Math.random() - 0.5) * 7;
    const width = 8 + intensity * 18 + Math.random() * 12;
    const delay = i * (18 - intensity * 8);

    ray.className = "radiation-ray";
    ray.style.setProperty("--ray-angle", `${spread + jitter}deg`);
    ray.style.setProperty("--ray-width", `${width}px`);
    ray.style.setProperty("--ray-delay", `${Math.max(delay, 0)}ms`);
    radiationEffects.appendChild(ray);
  }

  for (let i = 0; i < waveCount; i += 1) {
    const wave = document.createElement("span");
    wave.className = "radiation-wave";
    wave.style.setProperty("--wave-size", `${80 + i * 20 + intensity * 20}px`);
    wave.style.setProperty("--wave-delay", `${i * 130}ms`);
    radiationEffects.appendChild(wave);
  }

  radiationEffects.classList.remove("is-active");
  miceGrid.classList.remove("is-hit");

  void radiationEffects.offsetWidth;

  radiationEffects.classList.add("is-active");
  miceGrid.classList.add("is-hit");

  window.setTimeout(() => {
    radiationEffects.classList.remove("is-active");
    miceGrid.classList.remove("is-hit");
    radiationEffects.innerHTML = "";
  }, 1600);
}

function completeExposure() {
  cancelExposureTimer();

  const { duration, totalQuantity } = simulationState.exposure;
  simulationState.phase = "followup";
  simulationState.exposureElapsed = duration;
  simulationState.accumulatedQuantity = totalQuantity;
  simulationState.exposureStartedAt = null;
  simulationState.currentExperimentSaved = false;
  simulationState.currentSavedExperimentId = null;
  simulationState.currentDay = 0;
  simulationState.exposureEvents = [
    {
      totalQuantity,
      timeDay: 0,
    },
  ];

  irradiationButton?.classList.remove("is-firing");
  radiationEffects?.classList.remove("is-active");
  miceGrid?.classList.remove("is-hit");
  rebuildSimulation();
  renderExperimentPhase();
}

function updateExposureProgress() {
  if (
    simulationState.phase !== "exposing" ||
    simulationState.exposureStartedAt === null
  ) {
    return;
  }

  const duration = simulationState.exposure.duration;
  const elapsedSeconds =
    (window.performance.now() - simulationState.exposureStartedAt) / 1000;
  const progress = Math.min(1, elapsedSeconds / duration);

  simulationState.exposureElapsed = Math.min(duration, elapsedSeconds);
  simulationState.accumulatedQuantity =
    simulationState.exposure.totalQuantity * progress;
  renderExperimentPhase();

  if (progress >= 1) {
    completeExposure();
  }
}

function startExposure() {
  if (simulationState.phase !== "setup") {
    return;
  }

  syncExposureControls();
  stopPlayback();
  simulationState.phase = "exposing";
  simulationState.currentDay = 0;
  simulationState.exposureEvents = [];
  simulationState.appliedTotalQuantity = 0;
  simulationState.exposureElapsed = 0;
  simulationState.accumulatedQuantity = 0;
  simulationState.exposureStartedAt = window.performance.now();
  simulationState.currentExperimentSaved = false;
  simulationState.currentSavedExperimentId = null;
  rebuildSimulation();
  renderExperimentPhase();

  irradiationButton?.classList.add("is-firing");
  buildRadiationEffect(simulationState.exposure.totalQuantity);
  simulationState.exposureTimerId = window.setInterval(
    updateExposureProgress,
    50,
  );
}

function startFollowupWithoutExposure() {
  if (simulationState.phase !== "setup") {
    return;
  }

  cancelExposureTimer();
  stopPlayback();
  simulationState.phase = "followup";
  simulationState.exposure = {
    rateLevel: 0,
    rateLabel: "Καθόλου",
    rate: 0,
    durationLevel: 0,
    durationLabel: "Καθόλου",
    duration: 0,
    totalQuantityLevel: 0,
    totalQuantityLabel: "Καθόλου",
    totalQuantity: 0,
  };
  simulationState.currentDay = 0;
  simulationState.exposureEvents = [];
  simulationState.appliedTotalQuantity = 0;
  simulationState.exposureElapsed = 0;
  simulationState.accumulatedQuantity = 0;
  simulationState.exposureStartedAt = null;
  simulationState.currentExperimentSaved = false;
  simulationState.currentSavedExperimentId = null;
  rebuildSimulation();
  renderExperimentPhase();
}

function syncExposureControls() {
  if (!exposureRateSlider || !exposureDurationSlider) {
    return;
  }

  const rateLevel = Number(exposureRateSlider.value);
  const durationLevel = Number(exposureDurationSlider.value);
  const rateOption = getLevelOption(RATE_LEVELS, rateLevel);
  const durationOption = getLevelOption(DURATION_LEVELS, durationLevel);
  const rate = rateOption.value;
  const duration = durationOption.value;
  const combination = getExposureCombination(rateLevel, durationLevel);
  const totalQuantity = combination.totalQuantity;

  simulationState.exposure = {
    rateLevel: rateOption.level,
    rateLabel: rateOption.label,
    rate,
    durationLevel: durationOption.level,
    durationLabel: durationOption.label,
    duration,
    totalQuantityLevel: combination.step,
    totalQuantityLabel: combination.label,
    totalQuantity,
  };

  if (exposureRateValue) {
    exposureRateValue.textContent = rateOption.label;
    exposureRateSlider.setAttribute(
      "aria-valuetext",
      `${rateOption.label} ρυθμός έκθεσης`,
    );
  }

  if (exposureDurationValue) {
    exposureDurationValue.textContent = durationOption.label;
    exposureDurationSlider.setAttribute(
      "aria-valuetext",
      `${durationOption.label} χρόνος έκθεσης`,
    );
  }

  if (totalQuantitySlider) {
    totalQuantitySlider.value = String(combination.step);
    totalQuantitySlider.setAttribute(
      "aria-valuetext",
      `${combination.label} συνολική ποσότητα`,
    );
  }

  if (totalQuantityValue) {
    totalQuantityValue.textContent = combination.label;
  }

  if (totalQuantityNote) {
    const note = TOTAL_QUANTITY_NOTES[combination.label] ?? "";
    totalQuantityNote.textContent = note;
    totalQuantityNote.hidden = note === "";
  }

  if (formulaRate) {
    formulaRate.textContent = `${rateOption.label} ρυθμός`;
  }

  if (formulaDuration) {
    formulaDuration.textContent = `${durationOption.label} χρόνος`;
  }

  if (formulaTotal) {
    formulaTotal.textContent = `${combination.label} ποσότητα`;
  }

  if (simulationState.phase === "setup") {
    simulationState.exposureElapsed = 0;
    simulationState.accumulatedQuantity = 0;
    renderExperimentPhase();
  }
}

if (exposureRateSlider && exposureDurationSlider) {
  exposureRateSlider.addEventListener("input", syncExposureControls);
  exposureDurationSlider.addEventListener("input", syncExposureControls);
  syncExposureControls();
}

if (irradiationButton && exposureRateSlider && exposureDurationSlider) {
  irradiationButton.addEventListener("click", () => {
    startExposure();
  });
}

if (noExposureButton) {
  noExposureButton.addEventListener("click", () => {
    startFollowupWithoutExposure();
    startPlayback();
  });
}

if (playBtn) {
  playBtn.addEventListener("click", () => {
    if (simulationState.phase === "setup") {
      if (
        noExposureConfirmDialog instanceof HTMLDialogElement &&
        !noExposureConfirmDialog.open
      ) {
        noExposureConfirmDialog.showModal();
      }
      return;
    }

    startPlayback();
  });
}

if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    stopPlayback();
  });
}

if (backBtn) {
  backBtn.addEventListener("click", () => {
    stepTimeline(-1);
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    stepTimeline(1);
  });
}

if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    if (simulationState.phase === "exposing") {
      resetCurrentSimulation();
      return;
    }

    if (simulationState.phase === "followup") {
      stopPlayback();
      simulationState.currentDay = 0;
      renderChartFrame(simulationState.currentDay);
      renderExperimentPhase();
    }
  });
}

function resetCurrentSimulation() {
  cancelExposureTimer();
  stopPlayback();
  simulationState.phase = "setup";
  simulationState.exposureEvents = [];
  simulationState.appliedTotalQuantity = 0;
  simulationState.currentDay = 0;
  simulationState.exposureElapsed = 0;
  simulationState.accumulatedQuantity = 0;
  simulationState.exposureStartedAt = null;
  simulationState.currentExperimentSaved = false;
  simulationState.currentSavedExperimentId = null;
  irradiationButton?.classList.remove("is-firing");
  radiationEffects?.classList.remove("is-active");
  miceGrid?.classList.remove("is-hit");

  if (radiationEffects) {
    radiationEffects.innerHTML = "";
  }

  rebuildSimulation();
  syncExposureControls();
  renderExperimentPhase();
}

function saveCurrentExperiment() {
  if (
    simulationState.phase !== "followup" ||
    simulationState.currentExperimentSaved
  ) {
    return false;
  }

  const series = simulationState.series.map((point) => ({ ...point }));
  const points = series.map(
    (point) => `${monthToX(point.month)},${countToY(point.surviving)}`,
  );
  const pathData = buildCurvePath(points);

  if (!pathData) {
    return false;
  }

  const experimentId = simulationState.nextExperimentId;
  const paletteIndex = (experimentId - 1) % EXPERIMENT_COLORS.length;
  const dashIndex = (experimentId - 1) % EXPERIMENT_DASH_PATTERNS.length;
  const {
    rateLevel,
    rateLabel,
    rate,
    durationLevel,
    durationLabel,
    duration,
    totalQuantityLevel,
    totalQuantityLabel,
    totalQuantity,
  } = simulationState.exposure;

  simulationState.experiments.push({
    id: experimentId,
    rateLevel,
    rateLabel,
    rate,
    durationLevel,
    durationLabel,
    duration,
    totalQuantityLevel,
    totalQuantityLabel,
    totalQuantity,
    color: EXPERIMENT_COLORS[paletteIndex],
    dashPattern: EXPERIMENT_DASH_PATTERNS[dashIndex],
    pathData,
    series,
  });
  simulationState.nextExperimentId += 1;
  simulationState.selectedExperimentId = experimentId;
  simulationState.currentExperimentSaved = true;
  simulationState.currentSavedExperimentId = experimentId;
  renderExperimentCurves();
  renderExperimentComparison();
  renderExperimentPhase();
  return true;
}

if (saveExperimentBtn) {
  saveExperimentBtn.addEventListener("click", () => {
    saveCurrentExperiment();
  });
}

if (newExperimentBtn) {
  newExperimentBtn.addEventListener("click", () => {
    stopPlayback();

    if (simulationState.currentExperimentSaved) {
      resetCurrentSimulation();
      return;
    }

    if (
      newExperimentConfirmDialog instanceof HTMLDialogElement &&
      !newExperimentConfirmDialog.open
    ) {
      newExperimentConfirmDialog.showModal();
    }
  });
}

noExposureConfirmDialog
  ?.querySelector("[data-no-exposure-yes]")
  ?.addEventListener("click", () => {
    noExposureConfirmDialog.close();
    startFollowupWithoutExposure();
    startPlayback();
  });

noExposureConfirmDialog
  ?.querySelector("[data-no-exposure-no]")
  ?.addEventListener("click", () => {
    noExposureConfirmDialog.close();
  });

newExperimentConfirmDialog
  ?.querySelector("[data-save-previous-yes]")
  ?.addEventListener("click", () => {
    newExperimentConfirmDialog.close();
    saveCurrentExperiment();
    resetCurrentSimulation();
  });

newExperimentConfirmDialog
  ?.querySelector("[data-save-previous-no]")
  ?.addEventListener("click", () => {
    newExperimentConfirmDialog.close();
    resetCurrentSimulation();
  });

if (clearExperimentsBtn) {
  clearExperimentsBtn.addEventListener("click", () => {
    simulationState.experiments = [];
    simulationState.selectedExperimentId = null;
    simulationState.nextExperimentId = 1;
    simulationState.currentExperimentSaved = false;
    simulationState.currentSavedExperimentId = null;
    hideChartTooltip();
    hideExperimentCurveMarker();
    renderExperimentCurves();
    renderExperimentComparison();
    renderExperimentPhase();
  });
}

document.querySelectorAll("[data-open-info]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.openInfo);

    if (dialog instanceof HTMLDialogElement && !dialog.open) {
      dialog.showModal();
    }
  });
});

document.querySelectorAll(".info-dialog").forEach((dialog) => {
  dialog.querySelectorAll("[data-close-info]").forEach((button) => {
    button.addEventListener("click", () => dialog.close());
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});

if (impactHitPath) {
  impactHitPath.addEventListener("mouseenter", (event) => {
    const point = getCurrentCurvePoint(event);

    if (!point) {
      return;
    }

    showExperimentCurveMarker(point);
    showChartTooltip(event, point);
  });
  impactHitPath.addEventListener("mousemove", (event) => {
    const point = getCurrentCurvePoint(event);

    if (!point) {
      return;
    }

    showExperimentCurveMarker(point);
    moveChartTooltip(event, point);
  });
  impactHitPath.addEventListener("mouseleave", () => {
    hideExperimentCurveMarker();
    hideChartTooltip();
  });
}

if (miceGrid) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 100; i += 1) {
    const cell = document.createElement("div");
    cell.className = "mice-cell";

    const img = document.createElement("img");
    img.src = "images/mouse_64.png";
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.dataset.state = "alive";
    img.classList.add("mouse-alive");

    cell.appendChild(img);
    fragment.appendChild(cell);
    simulationState.mouseCells.push(img);
    simulationState.mouseMotionTimers.push(null);
  }

  miceGrid.appendChild(fragment);

  simulationState.mouseCells.forEach((_, index) => {
    scheduleMouseMotion(index);
  });
}

initializeChartSkeleton();
rebuildSimulation();
renderExperimentComparison();
