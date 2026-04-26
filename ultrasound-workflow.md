# Ultrasound Workflow - Visual Process Map

## High-Level Flow

```mermaid
flowchart TD
    A[Start: Patient Selection] --> B[Pull Patient from ezyVet]
    B --> C[Import Patient Details to V8]
    C --> D[Pre-configure Scan Type]
    D --> E[Scan Preparation]
    E --> F[Structured Scan Sequence]
    F --> G[Real-Time Dictation\nPlaud Voice Capture]
    G --> H[Report Creation]
    H --> I[System Integration\nUpload to ezyVet]
    I --> J[Complete - Report in Patient File]
```

---

## Step 1: Patient Setup

```mermaid
flowchart LR
    A[Select Patient from ezyVet] --> B[Import Details to Ultrasound]
    B --> C[Pre-configure Scan Type\nCase-based]
```

---

## Step 2: Scan Preparation

```mermaid
flowchart LR
    A[Start V8] --> B[Search & Select Patient]
    B --> C[Verify Patient Info]
    C --> D{Choose Probe}
    D -->|Cardiac| E[Cardiac Probe]
    D -->|Abdominal| F[Abdominal Probe]
    D -->|Small Parts| G[Small Parts Probe]
    E --> H{Select Scan Type}
    F --> H
    G --> H
    H --> I[Choose Patient Size\n<5kg / 5-15kg / >15kg]
    I --> J[Select Body Part\n/ Position]
    J --> K[Apply Preset Settings]
    K --> L[Ready to Scan]
```

---

## Step 3: Structured Scanning Sequence

### Abdominal Scan Order

```mermaid
flowchart TD
    A[Start: Urinary Bladder] --> B[Prostate\n(if male)]
    B --> C[Left Kidney]
    C --> D[Left Adrenal Gland]
    D --> E[Spleen\nTail → Body → Head]
    E --> F[Liver]
    F --> G[Gall Bladder]
    G --> H[Stomach]
    H --> I[Duodenum]
    I --> J[Pancreas]
    J --> K[Right Adrenal Gland]
    K --> L[Right Kidney]
    L --> M[Intestines\nGeneral]
```

### Cardiac Scan

```mermaid
flowchart LR
    A[Use ASEcho Guidelines] --> B[Use Heart Assist™\nfor small animals]
    B --> C[Automatic View Classification]
    C --> D[Auto-Measurement Tool]
    D --> E[Sonosync\nif needed]
```

---

## Step 4: Real-Time Dictation

```mermaid
flowchart LR
    A[Use Plaud Voice Capture] --> B[Speak Findings Real-Time]
    B --> C[Structured Template\naligned to scan sequence]
    C --> D[System Captures\nOrgan-by-Organ Notes]
```

---

## Step 5: Report Creation

```mermaid
flowchart LR
    A[Convert Dictation] --> B[Structured Report\nOrgan-by-Organ]
    B --> C[Add Recommendations]
    C --> D[Add Treatment Plan]
    D --> E[Report Complete]
```

---

## Step 6: System Integration

```mermaid
flowchart LR
    A[Upload Images to ezyVet] --> B[Attach Report to Patient Record]
    B --> C[Send to PACS\n(if needed)]
    C --> D[Complete]
```

---

## Key Decision Points

```mermaid
flowchart TD
    A[New Patient?] -->|Yes| B[Pull from ezyVet]
    A -->|No| C[Quick Search]
    B --> D[Import Details]
    C --> D
    D --> E{Scan Type?}
    E -->|Abdominal| F[Follow Abdominal Sequence]
    E -->|Cardiac| G[Follow Cardiac Sequence]
    E -->|Small Parts| H[Small Parts Sequence]
    F --> I[Dictate with Plaud]
    G --> I
    H --> I
    I --> J[Generate Report]
    J --> K[Upload to ezyVet]
```

---

## Integration Overview

```mermaid
flowchart LR
    ezVet[ezyVet\nPractice Management] -->|Patient Data| V8[Samsung V8\nUltrasound]
    V8 -->|Images + Data| Plaud[Plaud\nVoice Capture]
    Plaud -->|Dictated Audio| Report[Report Creation]
    Report -->|Final Report| ezVet
    Report -->|Images| PACS[PACS\nExternal]
```

---

## Key Principles

1. **Workflow First** → Define outcome, then align training/system
2. **Sequential > Flexible** → Fixed scan order reduces errors
3. **Reduce Decision Points** → Minimise thinking during scan
4. **Integration Non-Negotiable** → Must connect: V8 → Plaud → Reporting → ezyVet

---

_Generated from: Ultrasound Workflow design for vets..docx_
_Created: 2026-04-26_