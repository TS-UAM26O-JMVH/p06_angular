import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DireccionService } from '../../services/direccion';
import { ProgresoService } from '../../services/progreso';

@Component({
  selector: 'app-direccion',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './direccion.html',
  styleUrl: './direccion.css',
})
export class Direccion implements OnInit {
  formulario: FormGroup;
  campos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private direccionService: DireccionService,
    private progresoService: ProgresoService
  ) {
    this.formulario = this.fb.group({});
  }

  ngOnInit() {
    this.campos = this.direccionService.obtenerCampos();
    this.campos.forEach((campo) => {
      this.formulario.addControl(campo.name, this.fb.control('', campo.required ? Validators.required : null));
    });
  }

  enviarFormulario() {
    if (this.formulario.valid) {
      localStorage.setItem('datosFormularioDireccion', JSON.stringify(this.formulario.value));
      this.progresoService.completarPaso(2);
      this.progresoService.establecerPasoActual(3);
      this.router.navigate(['/fotografia']);
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
