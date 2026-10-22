import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Api } from '../../services/servAPI/api';

@Component({
  selector: 'app-bienvenido',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './bienvenido.html',
  styleUrl: './bienvenido.css',
})
export class Bienvenido {
  formulario: FormGroup;
  mostrarContrasena = false;
  errorLogin: string | null = null;

  campos = [
    {
      label: 'EMAIL',
      name: 'correo',
      type: 'email',
      required: true,
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    },
    {
      label: 'PASSWORD',
      name: 'contrasena',
      type: 'password',
      required: true,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private apiService: Api
  ) {
    this.formulario = this.fb.group({});
    this.campos.forEach((campo) => {
      const validators = campo.required ? [Validators.required] : [];
      if (campo.pattern) {
        validators.push(Validators.pattern(campo.pattern));
      }
      this.formulario.addControl(campo.name, this.fb.control('', validators));
    });
  }

  alternarVisibilidad() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  cambiarIdioma(lang: string) {
    this.translate.use(lang);
  }

  enviarFormulario() {
    if (this.formulario.valid) {
      const credenciales = {
        email: this.formulario.value.correo,
        password: this.formulario.value.contrasena,
      };

      this.apiService.login(credenciales).subscribe({
        next: () => {
          this.router.navigate(['/principal']);
        },
        error: (error) => {
          this.errorLogin = this.obtenerMensajeError(error);
          alert(this.errorLogin);
        },
      });
    } else {
      this.formulario.markAllAsTouched();
    }
  }

  private obtenerMensajeError(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    switch (error.status) {
      case 400:
        return 'Credenciales inválidas';
      case 401:
        return 'No autorizado';
      case 500:
        return 'Error interno del servidor';
      default:
        return 'Error al iniciar sesión';
    }
  }
}
