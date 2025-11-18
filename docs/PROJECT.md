# Laser Sensor Monitor - Tauri + Nuxt 3 Project

## Project Overview

Desktop application simulating an industrial laser sensor monitoring system using Tauri (Rust backend) and Nuxt 3 (frontend framework based on Vue 3). This project demonstrates real-time data processing, embedded device UI patterns, and high-performance desktop application architecture.

**Purpose:** Portfolio demonstration for embedded systems UI development (similar to Precitec 3D Metrology applications).

## Tech Stack

### Frontend

- Nuxt 3 (Vue 3 framework with conventions)
- TypeScript for type safety
- Pinia for state management (auto-configured in Nuxt)
- Chart.js or Apache ECharts for real-time charts
- Tailwind CSS + DaisyUI for styling (via Nuxt modules)

### Backend

- Rust (Tauri backend)
- tokio for async runtime
- serde for JSON serialization
- rand for sensor simulation

### Desktop Framework

- Tauri 2.0 - Lightweight desktop framework (Rust + WebView)

## Why Nuxt Instead of Vue Only

Nuxt provides critical structure for teams without dedicated frontend devs:

1. **File-based routing** (pages/ folder = automatic routes)
2. **Auto-imports** (components, composables, utilities)
3. **Built-in TypeScript support**
4. **SSR/SSG/SPA modes** (flexible deployment)
5. **Opinionated project structure** (less decisions needed)
6. **DevTools and better DX out-of-the-box**

For embedded devices:

- Can run as SPA (no server needed)
- Better performance than Vue-only setup
- Easier to maintain for non-frontend developers

## Project Structure

```text
├── src/                          (Nuxt frontend)
│   ├── pages/
│   │   └── index.vue             (Main dashboard - auto-routed)
│   ├── components/
│   │   ├── ControlPanel.vue      (Start/Stop/Stats buttons)
│   │   ├── MetricsDisplay.vue    (Real-time sensor readings)
│   │   ├── SensorChart.vue       (Line chart component)
│   │   └── StatisticsModal.vue   (Statistics popup)
│   ├── composables/
│   │   └── useSensorMonitor.ts   (Tauri integration composable)
│   ├── stores/
│   │   └── sensor.ts             (Pinia store - auto-imported)
│   ├── types/
│   │   └── sensor.ts             (TypeScript interfaces)
│   ├── app.vue                   (Root component)
│   └── nuxt.config.ts            (Nuxt configuration)
│
├── src-tauri/                    (Rust backend)
│   ├── src/
│   │   ├── main.rs               (Tauri app entry)
│   │   ├── commands.rs           (Tauri commands)
│   │   ├── device/
│   │   │   ├── mod.rs
│   │   │   ├── sensor.rs         (Sensor simulation)
│   │   │   └── processor.rs      (Data processing)
│   │   └── state.rs              (App state management)
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── README.md
└── package.json
```

## Nuxt Configuration

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  // SPA mode for Tauri (no server needed)
  ssr: false,

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: true
  },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  // Auto-imports
  imports: {
    dirs: ['composables', 'stores']
  },

  // App config
  app: {
    head: {
      title: 'Laser Sensor Monitor',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // Development
  devtools: { enabled: true }
})
```

## Core Features

### 1. Device Simulation (Rust Backend)

Simulates a laser metriology sensor with:

- Distance measurement (10-100mm range)
- Temperature monitoring (20-25 degrees Celsius)
- Laser intensity (500-2000 units)
- Processing time tracking (45-55ms)

#### Rust struct example

```rust
pub struct SensorReading {
    pub timestamp: DateTime<Utc>,
    pub distance_mm: f64,
    pub temperature: f64,
    pub intensity: u16,
    pub processing_time_ms: u64,
}
```

#### Key Rust functions

- `simulate_sensor_reading()` -> Generates realistic sensor data
- `apply_kalman_filter()` -> Simulates signal processing
- `calculate_statistics()` -> Aggregates data for reporting

### 2. Real-time Data Streaming

#### Backend Rust

- Async loop running at 10Hz (10 readings per second)
- Uses tokio for non-blocking operations
- Emits events to frontend via Tauri's event system

#### Frontend Nuxt

- Composable `useSensorMonitor()` handles Tauri integration
- Auto-imported in components
- Updates Pinia store reactively
- Maintains rolling buffer of last 50-100 readings

### 3. User Interface (Nuxt 3)

#### Main Page (pages/index.vue)

- Auto-routed as root page
- Imports components automatically
- Uses composable for Tauri logic

#### Control Panel Component

- START MONITORING button -> Initiates sensor loop
- STOP MONITORING button -> Halts data collection
- GET STATISTICS button -> Processes accumulated data

#### Metrics Display Component

- Real-time distance reading (mm)
- Current temperature (Celsius)
- Laser intensity level
- Processing time per reading

#### Data Visualization Component

- Line chart showing distance over time
- Auto-scrolling to show latest data
- Color-coded thresholds for anomalies

#### Statistics View Component

- Total readings count
- Average distance
- Min/Max values
- Standard deviation
- Average processing time

### 4. Nuxt Composables Pattern

#### composables/useSensorMonitor.ts

```typescript
// Auto-imported everywhere in Nuxt
export const useSensorMonitor = () => {
  const sensorStore = useSensorStore()

  // Tauri invoke wrapper
  const startMonitoring = async () => {
    await invoke('start_monitoring')
    sensorStore.setMonitoring(true)
  }

  const stopMonitoring = async () => {
    await invoke('stop_monitoring')
    sensorStore.setMonitoring(false)
  }

  // Event listener setup
  const setupEventListener = async () => {
    await listen('sensor-data', (event) => {
      sensorStore.addReading(event.payload)
    })
  }

  return {
    startMonitoring,
    stopMonitoring,
    setupEventListener
  }
}
```

#### Usage in components (auto-imported)

```vue
<script setup>
// No imports needed - Nuxt auto-imports!
const { startMonitoring, stopMonitoring } = useSensorMonitor()
const sensorStore = useSensorStore()
</script>
```

### 5. Pinia Store (Nuxt-style)

#### stores/sensor.ts

```typescript
// Auto-imported - no need to register
export const useSensorStore = defineStore('sensor', () => {
  const readings = ref<SensorReading[]>([])
  const isMonitoring = ref(false)

  const latestReading = computed(() =>
    readings.value[readings.value.length - 1]
  )

  const readingCount = computed(() =>
    readings.value.length
  )

  function addReading(reading: SensorReading) {
    readings.value.push(reading)
    if (readings.value.length > 100) {
      readings.value.shift()
    }
  }

  function setMonitoring(status: boolean) {
    isMonitoring.value = status
  }

  return {
    readings,
    isMonitoring,
    latestReading,
    readingCount,
    addReading,
    setMonitoring
  }
})
```

## Tauri Commands API

### Command: start_monitoring

- Initiates sensor simulation loop
- Returns: `Result<(), String>`
- Emits: "sensor-data" events continuously

### Command: stop_monitoring

- Stops the simulation loop
- Returns: `Result<(), String>`

### Command: get_statistics

- Processes all accumulated readings
- Returns: `Result<SensorStats, String>`
- Includes: count, averages, min, max, std_dev

### Command: get_reading_history

- Retrieves stored readings
- Parameters: limit (optional)
- Returns: `Result<Vec<SensorReading>, String>`

## Implementation Steps

### Phase 1: Project Setup (30 minutes)

1. **Create Nuxt project**

   ```bash
   npx nuxi init laser-sensor-monitor
   cd laser-sensor-monitor
   npm install
   ```

2. **Add Tauri to Nuxt project**

   ```bash
   npm install -D @tauri-apps/cli
   npx tauri init
   ```

3. **Install Nuxt modules**

   ```bash
   npx nuxi module add tailwindcss
   npm install @pinia/nuxt
   npm install chart.js vue-chartjs
   ```

4. **Install DaisyUI**

   ```bash
   npm install -D daisyui
   ```

5. **Configure nuxt.config.ts** (see Nuxt Configuration section)

6. **Add Rust dependencies to src-tauri/Cargo.toml**
   - tokio (features: full)
   - serde (features: derive)
   - serde_json
   - chrono
   - rand

### Phase 2: Rust Backend (2-3 hours)

1. **Create sensor simulation module** (device/sensor.rs)
   - Define SensorReading struct
   - Implement simulate_reading() function
   - Add Kalman filter simulation
2. **Create Tauri commands** (commands.rs)
   - start_monitoring command
   - stop_monitoring command
   - get_statistics command
3. **Setup application state** (state.rs)
   - Shared state with Arc<Mutex<T>>
   - Reading history buffer
   - Monitoring status flag
4. **Implement async event loop**
   - Use tokio::spawn for background task
   - Emit events every 100ms
   - Handle graceful shutdown

### Phase 3: Nuxt Frontend (2-3 hours)

1. **Create Pinia store** (stores/sensor.ts)
   - Uses Nuxt's auto-import (no manual registration)
   - State: readings array, isMonitoring flag
   - Actions: addReading, setMonitoring
   - Getters: latestReading, readingCount
2. **Create Tauri composable** (composables/useSensorMonitor.ts)
   - Wraps Tauri invoke calls
   - Handles event listeners
   - Auto-imported in all components
3. **Create main page** (pages/index.vue)
   - Auto-routed as root (/)
   - Imports components automatically (no import statements needed)
   - Uses composable for Tauri logic
4. **Build components** (components/ folder)
   - ControlPanel.vue (Start/Stop/Stats buttons)
   - MetricsDisplay.vue (Real-time values)
   - SensorChart.vue (Line chart)
   - StatisticsModal.vue (Stats popup)
   
   All auto-imported in pages/index.vue!

5. **Style with Tailwind + DaisyUI** (automatic via Nuxt modules)

### Phase 4: Integration (1 hour)

1. Wire up Tauri event listeners in composable
2. Test all command invocations
3. Handle error states
4. Add loading indicators
5. Polish UI/UX

### Phase 5: Polish & README (1 hour)

1. Add app icon
2. Configure Tauri window properties
3. Write comprehensive README
4. Add screenshots
5. Document Nuxt + Tauri architecture

## Nuxt-Specific Advantages

### 1. Auto-Imports

- Components: Just create in components/ folder
- Composables: Just create in composables/ folder
- Stores: Just create in stores/ folder
- No import statements needed!

### 2. File-Based Routing

- pages/index.vue -> / route
- pages/settings.vue -> /settings route
- Automatic navigation

### 3. Built-in TypeScript

- Full type checking out-of-the-box
- Auto-generated types for stores, composables
- Better DX than Vue-only setup

### 4. DevTools

- Visual state inspector
- Route debugger
- Component tree viewer
- Better debugging than Vue-only

### 5. Module Ecosystem

- @nuxtjs/tailwindcss - one command install
- @pinia/nuxt - auto-configured
- Many other modules ready to use

## Key Technical Concepts

### 1. Nuxt SPA Mode for Tauri

- Set ssr: false in nuxt.config.ts
- Generates client-side only app
- Perfect for desktop (no server needed)
- Still keeps Nuxt structure benefits

### 2. Composables as Logic Layer

- useSensorMonitor() handles all Tauri integration
- Reusable across components
- Auto-imported (no manual imports)
- Clean separation of concerns

### 3. Pinia with Nuxt

- Stores auto-registered
- SSR-ready (even in SPA mode for future)
- DevTools integration
- Better DX than plain Pinia

### 4. Async Rust vs Blocking

- Use async for I/O and events
- Prevents UI freezing
- tokio runtime manages threads

### 5. Tauri Event System

- Backend emits events: app.emit_all()
- Frontend listens via composable
- Bidirectional communication

## Project Timeline

### Day 1 (2-3 hours)

- Setup Nuxt + Tauri project
- Implement basic Rust sensor simulation
- Create simple Nuxt page with Start/Stop

### Day 2 (2-3 hours)

- Add composable for Tauri integration
- Implement statistics calculation
- Create real-time chart component

### Day 3 (1-2 hours)

- Add error handling
- Write README emphasizing Nuxt benefits
- Create screenshots
- Final testing

## Demo Script for Interview

### Opening statement

> "After our conversation, I built this using Nuxt 3 + Tauri. I chose Nuxt specifically because you mentioned it several times, and I understand why it's valuable for your team - it provides structure and conventions that make frontend development more manageable, especially when you don't have a dedicated frontend developer yet."

### Key talking points

- "Nuxt's auto-import system means less boilerplate - perfect for teams without dedicated frontend devs"
- "The composables pattern keeps Tauri logic organized and reusable"
- "File-based routing makes it easy to add new views as the app grows"
- "Even though it's a desktop app, Nuxt's structure benefits still apply in SPA mode"
- "The async Rust backend simulates your C++/Python embedded logic"

## Why Nuxt for Precitec

Perfect fit because:

1. You mentioned Nuxt multiple times (already in their stack)
2. No dedicated frontend dev yet = need strong conventions
3. Nuxt structure easier for backend devs to understand
4. Works perfectly with Tauri in SPA mode
5. Future-proof: can add SSR/SSG later if needed
6. Better DX = faster development with small team

## Repository Structure

Create GitHub repo with:

- Clear README explaining Nuxt + Tauri choice
- Architecture diagram showing Nuxt composables layer
- Setup instructions for Nuxt + Tauri combo
- Live demo GIF/video
- Code comments explaining Nuxt patterns
- MIT License

---

**Estimated Time:** 6-8 hours total  
**Project Complexity:** Intermediate  
**Portfolio Value:** Very High (Nuxt + Tauri + Niche)

## Next Steps

1. Create new Nuxt project (npx nuxi init)
2. Add Tauri to existing Nuxt project
3. Copy this file to project root as PROJECT_SPEC.txt
4. Follow implementation phases sequentially
5. Emphasize Nuxt benefits in interview
6. Test thoroughly before demo

Good luck!
