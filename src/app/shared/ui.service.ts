import { MatSnackBar } from "@angular/material";

export class UiService {

    constructor(private snackbar: MatSnackBar) {}
    
    showSnackbar(message, action, duration) {
        this.snackbar.open(message, action, {
            duration: duration
        })
    }
}