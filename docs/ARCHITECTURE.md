# Architecture - Laser Sensor Monitor

## System Architecture Overview

The Laser Sensor Monitor is a desktop application built with a hybrid architecture combining **Tauri** (Rust backend) and **Nuxt 3** (Vue 3 frontend). This architecture provides the performance of native desktop applications with the flexibility of modern web technologies.

```text
┌─────────────────────────────────────────────────────────────┐
│                    Desktop Application                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Nuxt 3)          │  Backend (Rust/Tauri)         │
│  ┌─────────────────────┐    │  ┌─────────────────────────┐  │
│  │ Vue 3 Components    │    │  │ Sensor Simulation       │  │
│  │ Pinia Store         │◄───┼──┤ Async Event Loop        │  │
│  │ Composables         │    │  │ Data Processing         │  │
│  │ Real-time Charts    │    │  │ Statistics Calculation  │  │
│  └─────────────────────┘    │  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Layer

- **Nuxt 3**: Vue 3 framework with conventions and auto-imports
- **TypeScript**: Type safety throughout the application
- **Pinia**: State management (auto-configured in Nuxt)
- **Chart.js/Apache ECharts**: Real-time data visualization
- **Tailwind CSS + DaisyUI**: Modern UI styling

### Backend Layer

- **Rust**: Systems programming language for performance
- **Tauri 2.0**: Lightweight desktop framework
- **tokio**: Async runtime for non-blocking operations
- **serde**: JSON serialization for data exchange
- **chrono**: Date/time handling for timestamps

### Communication Layer

- **Tauri Commands**: RPC-style function calls
- **Event System**: Real-time data streaming
- **JSON Serialization**: Structured data exchange

## Architectural Patterns

### 1. Layered Architecture

```text
┌─────────────────────────────────────┐
│           Presentation Layer        │
│  ┌─────────────────────────────────┐│
│  │    Vue Components (Nuxt 3)      ││
│  │  - ControlPanel.vue             ││
│  │  - MetricsDisplay.vue           ││
│  │  - SensorChart.vue              ││
│  │  - StatisticsModal.vue          ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│            Business Layer           │
│  ┌─────────────────────────────────┐│
│  │   Composables (useSensorMonitor)││
│  │   - Tauri command wrappers      ││
│  │   - Event listeners             ││
│  │   - State management logic      ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│             Data Layer              │
│  ┌─────────────────────────────────┐│
│  │    Pinia Store (sensor.ts)      ││
│  │   - Reactive state              ││
│  │   - Reading history buffer      ││
│  │   - Computed properties         ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│          Infrastructure Layer       │
│  ┌─────────────────────────────────┐│
│  │      Rust Backend (Tauri)       ││
│  │   - Sensor simulation           ││
│  │   - Data processing             ││
│  │   - Statistics calculation      ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### 2. Event-Driven Architecture

The application uses an event-driven pattern for real-time data flow:

```text
Sensor Simulation (Rust)
    │
    │ emits "sensor-data" events
    ▼
Tauri Event System
    │
    │ forwards events
    ▼
Frontend Event Listener
    │
    │ updates Pinia store
    ▼
Vue Components (Reactively Updated)
```

### 3. Composable Pattern

Nuxt's composable pattern encapsulates business logic:

```typescript
// composables/useSensorMonitor.ts
export const useSensorMonitor = () => {
  const sensorStore = useSensorStore()
  
  // Tauri command wrappers
  const startMonitoring = async () => { /* ... */ }
  const stopMonitoring = async () => { /* ... */ }
  
  // Event management
  const setupEventListener = async () => { 
    // Add event listener logic here
  }
  
  return { startMonitoring, stopMonitoring, setupEventListener }
}
```

## Data Flow Architecture

### Real-time Data Pipeline

1. **Data Generation** (Rust Backend)
   - Sensor simulation at 10Hz frequency
   - Kalman filter simulation for signal processing
   - Timestamp and metadata generation

2. **Data Transport** (Tauri Events)
   - Async event emission via `app.emit_all()`
   - JSON serialization for cross-language compatibility
   - Non-blocking I/O using tokio

3. **Data Processing** (Frontend)
   - Event listener in composable
   - Pinia store updates (reactive state)
   - Rolling buffer management (last 100 readings)

4. **Data Visualization** (Vue Components)
   - Reactive component updates
   - Chart rendering with Chart.js
   - UI state management

### State Management Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    Pinia Store                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │  State:                                              ││
│  │  - readings: SensorReading[]                        ││
│  │  - isMonitoring: boolean                            ││
│  │                                                      ││
│  │  Getters:                                            ││
│  │  - latestReading: SensorReading                     ││
│  │  - readingCount: number                             ││
│  │                                                      ││
│  │  Actions:                                            ││
│  │  - addReading(reading: SensorReading)               ││
│  │  - setMonitoring(status: boolean)                   ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Vue Component Hierarchy

```text
pages/index.vue (Root Dashboard)
├── ControlPanel.vue
│   ├── Start Monitoring Button
│   ├── Stop Monitoring Button
│   └── Get Statistics Button
├── MetricsDisplay.vue
│   ├── Distance Reading
│   ├── Temperature Display
│   ├── Intensity Level
│   └── Processing Time
├── SensorChart.vue
│   └── Real-time Line Chart
└── StatisticsModal.vue
    ├── Total Readings
    ├── Average Distance
    ├── Min/Max Values
    ├── Standard Deviation
    └── Average Processing Time
```

### Auto-Import Architecture

Nuxt's auto-import system eliminates manual imports:

```text
components/     → Auto-imported components
composables/    → Auto-imported composables
stores/         → Auto-imported Pinia stores
types/          → Auto-imported TypeScript types
```

## Security Architecture

### Tauri Security Model

1. **Capability System**
   - Fine-grained permissions for system access
   - Default-deny security posture
   - Explicit permission declarations

2. **Sandboxed Frontend**
   - WebView isolation from system resources
   - No direct filesystem access
   - Controlled API exposure through commands

3. **Secure IPC**
   - Type-safe command definitions
   - Serialized data transfer
   - Error handling and validation

## Performance Architecture

### Rust Backend Optimizations

1. **Async Runtime**
   - tokio for non-blocking I/O
   - Concurrent task execution
   - Efficient resource utilization

2. **Memory Management**
   - Zero-cost abstractions
   - Ownership system prevents memory leaks
   - Stack allocation where possible

3. **Data Processing**
   - Efficient algorithms for statistics
   - Minimal JSON serialization overhead
   - Optimized sensor simulation

### Frontend Optimizations

1. **Reactive Updates**
   - Pinia's efficient reactivity system
   - Component-level state isolation
   - Minimal re-renders

2. **Chart Performance**
   - Data point limiting (rolling buffer)
   - Efficient canvas rendering
   - Debounced update cycles

## Deployment Architecture

### Desktop Application Structure

```text
laser-sensor-monitor.app/
├── Contents/
│   ├── MacOS/
│   │   └── laser-sensor-monitor      # Rust binary
│   ├── Resources/
│   │   └── webview/                  # Built Nuxt app
│   └── Info.plist                    # App metadata
└── ...                                # Platform-specific files
```

### Build Process

1. **Frontend Build**
   - Nuxt generates static SPA
   - Asset optimization and minification
   - TypeScript compilation

2. **Backend Build**
   - Rust compilation to native binary
   - Tauri configuration processing
   - Code signing and notarization

3. **Package Assembly**
   - WebView integration
   - Resource bundling
   - Platform-specific packaging

## Scalability Architecture

### Extensibility Points

1. **Sensor Plugins**
   - Modular sensor simulation
   - Configurable data sources
   - Pluggable processing algorithms

2. **UI Components**
   - Component-based architecture
   - Reusable visualization widgets
   - Theme system via DaisyUI

3. **Data Export**
   - Multiple format support (JSON, CSV)
   - Configurable export intervals
   - Real-time streaming capabilities

### Future Architecture Considerations

1. **Multi-Window Support**
   - Independent window management
   - Cross-window state synchronization
   - Window-specific configurations

2. **Plugin System**
   - Dynamic plugin loading
   - Third-party extension support
   - Sandboxed plugin execution

3. **Cloud Integration**
   - Remote data synchronization
   - Cloud-based analytics
   - Multi-device coordination

This architecture provides a solid foundation for embedded systems UI development, combining the performance and safety of Rust with the developer experience and ecosystem of Nuxt 3.
