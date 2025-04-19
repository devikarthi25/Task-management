import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Column } from '../../../models/column.model';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, ReactiveFormsModule, MatMenuModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
})
export class TaskModalComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  form!: FormGroup;
  opened = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      task: Task;
      darkMode: boolean;
      columns: Column[];
      editMode: boolean;
    },
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.nonNullable.group({
      title: this.fb.control(this.data.task?.title || '', {
        validators: [Validators.required],
      }),
      description: this.fb.control(this.data.task?.description || ''),
      status: this.fb.control(
        this.data.task?.status || this.data.columns[0].name,
        {
          validators: [Validators.required],
        },
      ),
    });
  }

  openDropdown(): void {
    this.trigger.openMenu();
  }

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }

  submit() {
    const editMode = this.data.editMode;

    if (editMode) {
      const updatedBoard: Task = {
        ...this.data.task,
        ...this.form.value,
      };

      this.dialogRef.close({ ...updatedBoard });
    }

    if (!editMode) {
      this.dialogRef.close({ ...this.form.value });
    }
  }
}
