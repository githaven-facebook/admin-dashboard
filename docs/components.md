# Component Library

## UI Components
We use Material UI (MUI) v5 for all UI components.

### Common Usage
```tsx
import { Button, TextField, DataGrid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
```

### Theming
Custom theme is defined in `src/theme/index.ts`.
Use `styled()` API for custom components.

### Data Tables
Use MUI DataGrid for all table views:
```tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';
```

### Forms
Use Formik + Yup for all form handling:
```tsx
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
```
