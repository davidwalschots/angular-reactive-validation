import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'arv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private fb: FormBuilder) { }

  title = 'app';

  form = this.fb.group({
    name: this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]]
    }),
    age: [null, [Validators.required, Validators.min(0), Validators.max(150)]]
  });
}
