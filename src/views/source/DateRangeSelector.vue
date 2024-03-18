<template>
  <div
    style="border-radius: 6px"
    ref="chartContainer"
    class="chart-container"
    :style="{ height: height + 'px' }"
    @mousedown="startDragging"
    @mousemove="handleMouseMove"
    @mouseup="endDragging"
    @mouseleave="endDragging"
  >
    <!-- Dynamically Generated Chart -->
    <svg width="100%" :height="height + 'px'">
      <!-- Polyline for values -->
      <polyline :points="polylinePoints" fill="none" stroke="blue" stroke-width="2" />
      <!-- X-axis lines and labels for selected dates -->
      <line v-for="date in displayedDates" :key="date.x" :x1="date.x" :y1="0" :x2="date.x" :y2="height" stroke="#808080" stroke-width="1" stroke-dasharray="4" />
      <text v-for="date in displayedDates" :key="`text-${date.x}`" :x="date.x" :y="height - 10" font-size="12" text-anchor="middle" font-weight="bold">{{ date.label }}</text>
    </svg>
    <!-- Overlay -->
    <div class="overlay" :style="{ left: overlayPosition + 'px', width: overlayWidth + 'px' }">
      <div class="handle left-handle" @mousedown.stop="startResizing($event, 'left')"></div>
      <div class="handle right-handle" @mousedown.stop="startResizing($event, 'right')"></div>
    </div>
  </div>
  <div class="toolbar">
    <div class="date-inputs">
      <input type="date" v-model="startDate" @input="updateOverlayPosition" readonly class="date-input" style="height: 20px;font-size: 11px;" />
      <input type="date" v-model="endDate" @input="updateOverlayWidth" readonly class="date-input" style="height: 20px;font-size: 11px;"/>
    </div>
    <div class="event-controls">
      <input type="text" :value="`Events: ${sumOfSelectedRange}`" readonly class="sum-input" style="height: 20px;font-size: 11px;"/>
    </div>


  </div>

</template>



<script setup>
  import {computed, onMounted, onUnmounted, ref, watch} from 'vue';

  const emit = defineEmits(['dateRangeUpdated']);

  const props = defineProps({
    height: {
      type: Number,
      default: 50 // Default height if not provided
    },
    startDate: {
      type: String,
      default: "2023-01-01" // Default to today's date
    },
    values: {
      type: Array,
      default: () => ([
        65, 59, 80, 81, 56, 55, 40, 72, 88, 95, 102, 110, 105, 99, 85, 75, 65, 59, 80,
        81, 56, 55, 40, 45, 50, 55, 60, 65, 70, 75, 80
      ]),
    },
  });

  const chartContainer = ref(null);
  const overlayPosition = ref(50);
  const overlayWidth = ref(100);
  const svgWidth = ref(600); // Updated dynamically to match container width
  const values = ref(props.values);

  // Watch for changes in props.values and update the internal values ref accordingly
  watch(() => props.values, (newValues) => {
    values.value = newValues;
  }, { deep: true });

  const chartMargin = ref(50);
  const startDate = ref(null);
  const endDate = ref(null);

  const updateSvgWidth = () => {
    if (chartContainer.value) {
      svgWidth.value = chartContainer.value.offsetWidth;
    }
  };

  const resizeObserver = new ResizeObserver(updateSvgWidth);

  onMounted(() => {
    resizeObserver.observe(chartContainer.value);
    updateSvgWidth();
  });

  onUnmounted(() => {
    resizeObserver.disconnect();
  });

  const polylinePoints = computed(() => {
    const maxVal = Math.max(...values.value);
    const svgHeight = props.height; // Use the dynamic height prop
    const maxHeight = svgHeight - 30; // Adjusting max height for visualization within the SVG
    const effectiveWidth = svgWidth.value - 2 * chartMargin.value;
    return values.value.map((val, index) => {
      const x = chartMargin.value + (effectiveWidth / (values.value.length - 1)) * index;
      const y = (svgHeight - 20) - (val / maxVal) * maxHeight; // Ensure polyline fits within the SVG height, adjusting for labels
      return `${x},${y}`;
    }).join(' ');
  });

  const displayedDates = computed(() => {
    const baseDate = new Date(props.startDate);
    const dateLabels = values.value.map((_, index) => {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + index);
      return date.toLocaleDateString();
    });

    const numDates = values.value.length;
    const effectiveWidth = svgWidth.value - 2 * chartMargin.value;
    const labelYPosition = props.height - 10;

    return [0, Math.floor(numDates / 2), numDates - 1].map(index => ({
      label: dateLabels[index],
      x: chartMargin.value + (effectiveWidth / (numDates - 1)) * index,
      y: labelYPosition,
    }));
  });


  let startDragX = 0;
  let resizing = ref(false);
  let dragging = ref(false);
  let resizeSide = ref('');

  const startDragging = (event) => {
    if (resizing.value) return; // Prevent dragging when resizing
    dragging.value = true;
    startDragX = event.clientX - overlayPosition.value;
  };

  const startResizing = (event, side) => {
    event.stopPropagation(); // Prevent triggering drag when starting resize
    resizing.value = true;
    resizeSide.value = side;
    startDragX = event.clientX;
  };

  const handleMouseMove = (event) => {
    if (dragging.value && !resizing.value) {
      let newLeft = event.clientX - startDragX;
      newLeft = Math.max(newLeft, 0); // Prevent overlay from moving out on the left
      newLeft = Math.min(newLeft, chartContainer.value.offsetWidth - overlayWidth.value); // Prevent overlay from moving out on the right
      overlayPosition.value = newLeft;
    } else if (resizing.value) {
      // Resizing logic here
    }
  };
  document.addEventListener('mousemove', (event) => {
    if (dragging.value && !resizing.value) {
      let newLeft = event.clientX - startDragX;
      newLeft = Math.max(newLeft, 0); // Prevent overlay from moving out on the left
      newLeft = Math.min(newLeft, chartContainer.value.offsetWidth - overlayWidth.value); // Prevent overlay from moving out on the right
      overlayPosition.value = newLeft;
    } else if (resizing.value) {
      let delta = event.clientX - startDragX;
      if (resizeSide.value === 'left') {
        let newLeft = overlayPosition.value + delta;
        let newWidth = overlayWidth.value - delta;
        if (newLeft >= 0 && newWidth >= 0) {
          overlayPosition.value = newLeft;
          overlayWidth.value = newWidth;
          startDragX = event.clientX;
        }
      } else if (resizeSide.value === 'right') {
        let newWidth = overlayWidth.value + delta;
        if (newWidth >= 0 && overlayPosition.value + newWidth <= chartContainer.value.offsetWidth) {
          overlayWidth.value = newWidth;
          startDragX = event.clientX;
        }
      }
    }
  });

  const endDragging = () => {
    dragging.value = false;
    resizing.value = false;
  };

  const calculateAndDisplayDates = () => {
    const totalDays = values.value.length;
    const chartWidth = svgWidth.value - 2 * chartMargin.value;
    const overlayStartRatio = (overlayPosition.value - chartMargin.value) / chartWidth;
    const overlayEndRatio = (overlayPosition.value + overlayWidth.value - chartMargin.value) / chartWidth;

    const startIndex = Math.round(totalDays * overlayStartRatio);
    const endIndex = Math.round(totalDays * overlayEndRatio);

    // Use the startDate prop instead of assuming the current date
    const baseDate = new Date(props.startDate);

    // Calculate the start date based on the overlay's position
    const startDateObj = new Date(baseDate);
    startDateObj.setDate(startDateObj.getDate() + startIndex - 1); // Adjust based on overlay position

    // Calculate the end date based on the overlay's position and width
    const endDateObj = new Date(baseDate);
    endDateObj.setDate(endDateObj.getDate() + endIndex - 1); // Adjust based on overlay width

    // Update the reactive references to reflect the new start and end dates
    startDate.value = startDateObj.toISOString().split('T')[0];
    endDate.value = endDateObj.toISOString().split('T')[0];

    emit('dateRangeUpdated', { startDate: startDate.value, endDate: endDate.value });
  };


  // Watch for changes in overlay position or size and update the dates
  watch([overlayPosition, overlayWidth], () => {
    nextTick(() => {
      calculateAndDisplayDates();
    });
  }, { deep: true, immediate: true });

  const sumOfSelectedRange = computed(() => {
    if (!values.value.length) return 0;

    const totalWidth = svgWidth.value - 2 * chartMargin.value;
    const startIndex = Math.floor(((overlayPosition.value - chartMargin.value) / totalWidth) * values.value.length);
    const endIndex = Math.floor(((overlayPosition.value + overlayWidth.value - chartMargin.value) / totalWidth) * values.value.length);

    const selectedValues = values.value.slice(startIndex, endIndex + 1);
    return selectedValues.reduce((acc, val) => acc + val, 0);
  });



</script>
<style>
  .chart-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 50px;
    border: 1px solid #ccc;
    user-select: none;
    position: relative;
    overflow: hidden; /* Ensures nothing spills out of the container */
  }

  /* Enhanced polyline style */
  svg polyline {
    stroke: #007bff; /* A brighter blue for better visibility */
    stroke-width: 3; /* Slightly thicker line */
  }

  /* Improved text legibility */
  svg text {
    fill: #333;
    stroke: #fff;
    stroke-width: 0.5;
    paint-order: stroke;
  }

  /* Overlay style adjustments */
  .overlay {
    position: absolute;
    top: 0;
    height: 100%;
    background-color: rgba(100, 100, 255, 0.2); /* Adjusted color for a softer look */
    cursor: grab;
    border-radius: 4px; /* Rounded corners for a smoother look */
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
  }

  /* Handle enhancements */
  .handle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 12px; /* Slightly wider for easier interaction */
    background-color: #eee; /* Lighter color for contrast */
    border: 1px solid #ccc; /* Subtle border */
    cursor: ew-resize;
    opacity: 0.5; /* Adjust opacity to desired transparency level */
  }

  .handle:hover {
    background-color: #ddd; /* Darker color on hover for feedback */
    opacity: 0.7; /* Slightly less transparent on hover to indicate interactability */
  }

  .left-handle {
    left: -6px; /* Adjusted to align with the wider handle */
    border-radius: 4px 0 0 4px; /* Rounded corners on the left */
  }

  .right-handle {
    right: -6px; /* Adjusted to align with the wider handle */
    border-radius: 0 4px 4px 0; /* Rounded corners on the right */
  }

  /* Date inputs style */
  .date-input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between; /* Aligns children to each side with space between */
    padding: 10px 0px;
    padding-bottom: 20px;
  }

  .date-inputs, .event-controls {
    display: flex;
    align-items: center; /* Centers items vertically */
  }

  .date-input, .scale-select {
    margin-right: 10px; /* Adds spacing between inputs/selects */
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .date-input:last-child, .scale-select:last-child {
    margin-right: 0; /* Removes margin from the last element */
  }

  /* Enhance the visual separation between the chart and the toolbar */
  .chart-container + .toolbar {
    border-top: 1px solid #ccc;
  }
  .sum-input {
    background-color: #f0f0f0; /* Light grey background */
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 4px;
    margin-left: 10px;
  }
</style>

