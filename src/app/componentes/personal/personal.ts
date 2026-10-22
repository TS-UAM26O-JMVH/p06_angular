import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PersonalService } from '../../services/personal';
import { ProgresoService } from '../../services/progreso';

@Component({
  selector: 'app-personal',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './personal.html',
  styleUrl: './personal.css',
})
export class Personal implements OnInit {
  formulario: FormGroup;
  campos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private personalService: PersonalService,
    private progresoService: ProgresoService
  ) {
    this.formulario = this.fb.group({});
  }

  ngOnInit() {
    this.campos = this.personalService.obtenerCampos();
    this.campos.forEach((campo) => {
      this.formulario.addControl(campo.name, this.fb.control('', campo.required ? Validators.required : null));
    });
  }

  enviarFormulario() {
    if (this.formulario.valid) {
      localStorage.setItem('datosFormularioPersonal', JSON.stringify(this.formulario.value));
      this.progresoService.completarPaso(0);
      this.progresoService.establecerPasoActual(1);
      this.router.navigate(['/cuenta']);
    } else {
      this.formulario.markAllAsTouched();
    }
  }

  cambiarIdioma(lang: string) {
    this.translate.use(lang);
  }

  regresar() {
    this.router.navigate(['/registro']);
  }
}
