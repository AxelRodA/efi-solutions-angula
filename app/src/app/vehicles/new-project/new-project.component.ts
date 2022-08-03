import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from './../../shared/models/project.model';
import { AuthService } from './../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
})
export class NewProjectComponent implements OnInit {
  projectForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      color: ['', [Validators.required]],
    });
  }

  async newProject() {
    const key = this.afs.createId();
    const { name, color } = this.projectForm.value;
    const { uid } = await this.auth.getUser();
    const created = firebase.firestore.Timestamp.fromDate(new Date(Date.now()));
    const data: Project = {
      key,
      name,
      color,
      created,
      createdBy: uid,
    };
    this.afs.collection('projects').doc(key).set(data);
  }
}
