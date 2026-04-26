# Ultrasound Workflow - 6 Core Steps

```mermaid
flowchart TD
    START([START]) --> A1
    
    subgraph Step1 [Step 1: Patient Setup]
    direction TB
    A1[Select patient from ezyVet] --> A2[Import details to V8]
    A2 --> A3[Pre-configure scan type]
    end
    
    A1 --> Step1
    Step1 --> A
    
    A[↓] --> B
    
    subgraph Step2 [Step 2: Scan Preparation]
    direction TB
    B1[Select patient on V8] --> B2[Choose probe]
    B2 --> B3[Select scan type]
    B3 --> B4[Apply presets]
    B4 --> B5[Confirm settings]
    end
    
    B --> Step2
    Step2 --> C{◇ Settings Correct?}
    
    C -->|Yes| D
    C -->|No| B2
    
    D[↓] --> E
    
    subgraph Step3 [Step 3: Structured Scanning]
    direction TB
    E1[Follow fixed sequence] --> E2[Organ-by-organ scan]
    E2 --> E3[Use Sonosync / ez scan]
    end
    
    E --> Step3
    Step3 --> F
    
    F[↓] --> G
    
    subgraph Step4 [Step 4: Real-Time Dictation]
    direction TB
    G1[Capture via Plaud] --> G2[Speak findings live]
    G2 --> G3[Structured input]
    end
    
    G --> Step4
    Step4 --> H
    
    H[↓] --> I
    
    subgraph Step5 [Step 5: Report Creation]
    direction TB
    I1[Convert dictation] --> I2[Structured report]
    I2 --> I3[Add recommendations]
    end
    
    I --> Step5
    Step5 --> J
    
    J[↓] --> K
    
    subgraph Step6 [Step 6: System Integration]
    direction TB
    K1[Upload images to ezyVet] --> K2[Attach report to patient]
    K2 --> K3[Share via PACS if needed]
    end
    
    K --> Step6
    Step6 --> END([END])
    
    classDef step fill:#e6f3ff,stroke:#0066cc,stroke-width:2px,color:#333;
    classDef decision fill:#fff3cd,stroke:#ffc107,stroke-width:2px,color:#333;
    classDef startend fill:#d4edda,stroke:#28a745,stroke-width:2px,color:#333;
    
    class Step1,Step2,Step3,Step4,Step5,Step6 step;
    class C decision;
    class START,END startend;
```

---

**View online:** https://raw.githubusercontent.com/brendan134/mission-control/master/ultrasound-workflow-simple.html

(Open in browser - renders as interactive diagram)