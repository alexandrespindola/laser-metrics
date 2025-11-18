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
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **DaisyUI**: Component library built on Tailwind CSS for UI components

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

## Styling Architecture

### Tailwind CSS Integration

```text
┌─────────────────────────────────────────────────────────┐
│                 Styling Layer                            │
│  ┌─────────────────────────────────────────────────────┐│
│  │    Tailwind CSS (Utility-First)                     ││
│  │   - Responsive utilities (sm:, md:, lg:)            ││
│  │   - Color system (slate, blue, green)              ││
│  │   - Spacing, typography, layout utilities           ││
│  │   - Dark mode support                               ││
│  └─────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────┐│
│  │    DaisyUI (Component Library)                      ││
│  │   - Pre-built components (btn, card, modal)        ││
│  │   - Design system themes                            ││
│  │   - Accessibility features                         ││
│  │   - Animation utilities                            ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Tailwind CSS Architecture

1. **Utility-First Approach**
   - Atomic CSS classes for rapid development
   - Consistent design system without custom CSS
   - Responsive design through breakpoint prefixes
   - Dark mode support with `dark:` prefix

2. **Configuration Strategy**

   ```javascript
   // tailwind.config.js
   module.exports = {
     content: ['./components/**/*.{vue,js}', './layouts/**/*.vue'],
     theme: {
       extend: {
         colors: {
           primary: '#3b82f6',
           secondary: '#64748b'
         }
       }
     },
     plugins: [require('daisyui')]
   }
   ```

3. **Component Styling Pattern**

   ```vue
   <template>
     <div class="card w-96 bg-base-100 shadow-xl">
       <div class="card-body">
         <h2 class="card-title">Sensor Data</h2>
         <div class="stats shadow">
           <div class="stat">
             <div class="stat-title">Distance</div>
             <div class="stat-value text-primary">{{ distance }}mm</div>
           </div>
         </div>
       </div>
     </div>
   </template>
   ```

### DaisyUI Component System

1. **Design Tokens**
   - CSS custom properties for theming
   - Semantic color naming (primary, secondary, accent)
   - Consistent spacing and typography scales
   - Built-in dark/light theme support

2. **Component Library**
   - **Form Components**: btn, input, select, checkbox
   - **Layout Components**: card, hero, navbar, footer
   - **Feedback Components**: alert, modal, loading, toast
   - **Data Display**: table, stats, timeline, tree

3. **Theme Architecture**

   ```css
   /* DaisyUI theme system */
   :root {
     --p: #3b82f6;      /* Primary color */
     --pc: #ffffff;     /* Primary content */
     --s: #64748b;      /* Secondary color */
     --sc: #ffffff;     /* Secondary content */
     --a: #10b981;      /* Accent color */
     --ac: #ffffff;     /* Accent content */
   }
   ```

### Styling Workflow

1. **Development Process**
   - Utility classes for rapid prototyping
   - DaisyUI components for consistent UI
   - Component variants with `@apply` directives
   - Responsive design with breakpoint prefixes

2. **Performance Optimization**
   - PurgeCSS removes unused utilities in production
   - Minimal CSS bundle size
   - No runtime CSS overhead
   - Critical CSS extraction for desktop app

3. **Desktop-Specific Considerations**
   - Fixed layouts (no mobile-first constraints)
   - High-density information display
   - Consistent cross-platform rendering
   - Native-like interaction patterns

## Component Architecture

### Vue Component Hierarchy

```text
pages/index.vue (Root Dashboard)
├── ControlPanel.vue
│   ├── Start Monitoring Button (btn btn-primary)
│   ├── Stop Monitoring Button (btn btn-secondary)
│   └── Get Statistics Button (btn btn-accent)
├── MetricsDisplay.vue
│   ├── Distance Reading (stat-value text-primary)
│   ├── Temperature Display (stat-value text-info)
│   ├── Intensity Level (stat-value text-warning)
│   └── Processing Time (stat-value text-success)
├── SensorChart.vue
│   └── Real-time Line Chart (card bg-base-100)
└── StatisticsModal.vue
    ├── Total Readings (stat)
    ├── Average Distance (stat)
    ├── Min/Max Values (stat)
    ├── Standard Deviation (stat)
    └── Average Processing Time (stat)
```

### Styling Integration with Components

1. **Component-Based Styling**
   ```vue
   <!-- ControlPanel.vue -->
   <template>
     <div class="flex gap-4 p-4 bg-base-200 rounded-lg">
       <button 
         @click="startMonitoring"
         :disabled="isMonitoring"
         class="btn btn-primary btn-sm"
       >
         Start Monitoring
       </button>
       <button 
         @click="stopMonitoring"
         :disabled="!isMonitoring"
         class="btn btn-secondary btn-sm"
       >
         Stop Monitoring
       </button>
     </div>
   </template>
   ```

2. **Responsive Design Patterns**
   ```vue
   <!-- MetricsDisplay.vue -->
   <template>
     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       <div class="stat bg-base-100 rounded-lg shadow">
         <div class="stat-title">Distance</div>
         <div class="stat-value text-primary">{{ latestReading.distance }}mm</div>
       </div>
       <!-- More stats... -->
     </div>
   </template>
   ```

3. **Theme Integration**
   ```vue
   <!-- SensorChart.vue -->
   <template>
     <div class="card w-full bg-base-100 shadow-xl">
       <div class="card-body">
         <h2 class="card-title text-base-content">Real-time Data</h2>
         <div class="chart-container bg-base-200 rounded-lg p-4">
           <canvas ref="chartCanvas" class="w-full h-64"></canvas>
         </div>
       </div>
     </div>
   </template>
   ```

### Auto-Import Architecture

Nuxt's auto-import system eliminates manual imports:

```text
components/     → Auto-imported components
composables/    → Auto-imported composables
stores/         → Auto-imported Pinia stores
types/          → Auto-imported TypeScript types
```

### Nuxt + Tailwind + DaisyUI Integration

1. **Module Configuration**

   ```typescript
   // nuxt.config.ts
   export default defineNuxtConfig({
     modules: [
       '@nuxtjs/tailwindcss',
       '@pinia/nuxt'
     ],
     tailwindcss: {
       configPath: './tailwind.config.js',
       cssPath: '~/assets/css/tailwind.css',
       viewer: false
     }
   })
   ```

2. **CSS Architecture**

   ```css
   /* assets/css/tailwind.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   /* Custom component styles */
   @layer components {
     .sensor-card {
       @apply card bg-base-100 shadow-xl border border-base-300;
     }
     
     .metric-value {
       @apply stat-value text-2xl font-mono;
     }
   }
   ```

3. **Theme Configuration**

   ```javascript
   // tailwind.config.js
   module.exports = {
     content: [
       "./components/**/*.{js,vue,ts}",
       "./layouts/**/*.vue",
       "./pages/**/*.vue",
       "./plugins/**/*.{js,ts}",
       "./nuxt.config.{js,ts}"
     ],
     theme: {
       extend: {
         colors: {
           sensor: {
             distance: '#3b82f6',
             temperature: '#ef4444',
             intensity: '#10b981',
             processing: '#f59e0b'
           }
         }
       }
     },
     plugins: [require('daisyui')],
     daisyui: {
       themes: ['light', 'dark', 'cupcake'],
       darkTheme: 'dark'
     }
   }
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
