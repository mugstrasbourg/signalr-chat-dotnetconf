import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'chat-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  public name = "";

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>) {}

  onOkCLick(): void {
    this.dialogRef.close(this.name);
  }
}
