import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CuentaService } from '../../services/cuenta';
import { ProgresoService } from '../../services/progreso';

@Component({
  selector: 'app-cuenta',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.css',
})
export class Cuenta implements OnInit {
  formulario: FormGroup;
  campos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private cuentaService: CuentaService,
    private progresoService: ProgresoService
  ) {
    this.formulario = this.fb.group({});
  }

  ngOnInit() {
    this.campos = this.cuentaService.obtenerCampos();
    this.campos.forEach((campo) => {
      const validators = campo.required ? [Validators.required] : [];
      if (campo.pattern) validators.push(Validators.pattern(campo.pattern));
      this.formulario.addControl(campo.name, this.fb.control('', validators));
    });
  }

  enviarFormulario() {
    if (this.formulario.valid) {
      localStorage.setItem('datosFormularioCuenta', JSON.stringify(this.formulario.value));
      this.progresoService.completarPaso(1);
      this.progresoService.establecerPasoActual(2);
      this.router.navigate(['/direccion']);
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
