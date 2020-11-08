import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyModule, FORMLY_CONFIG } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { SignupPageRoutingModule } from './signup-routing.module';
import { SignupPage } from './signup.page';

export function fieldMatchValidator(control: AbstractControl) {
  const { password, repeatPassword } = control.value;

  // avoid displaying the message error when values are empty
  if (!repeatPassword || !password) {
    // tslint:disable-next-line: no-null-keyword
    return null;
  }

  if (repeatPassword === password) {
    // tslint:disable-next-line: no-null-keyword
    return null;
  }

  return { fieldMatch: true };
}


export function registerValidationMessages(translocoService: TranslocoService) {
  return {
    validationMessages: [
      {
        name: 'pattern',
        message() {
          return translocoService.selectTranslate('message.pleaseEnterValidEmail');
        },
      },
      {
        name: 'minlength',
        message(_: any, fields: FormlyFieldConfig) {
          return translocoService.selectTranslate(
            'message.passwordMustBeBetween',
            { min: fields?.templateOptions?.minLength, max: fields?.templateOptions?.maxLength },
          );
        },
      },
      {
        name: 'maxlength',
        message(_: any, fields: FormlyFieldConfig) {
          return translocoService.selectTranslate(
            'message.passwordMustBeBetween',
            { min: fields?.templateOptions?.minLength, max: fields?.templateOptions?.maxLength },
          );
        },
      },
      {
        name: 'fieldMatch',
        message() {
          return translocoService.selectTranslate('message.passwordNotMatching');
        },
      }
    ]
  };
}

@NgModule({
  imports: [
    TranslocoModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({ validators: [{ name: 'fieldMatch', validation: fieldMatchValidator }], extras: { lazyRender: true }, }),
    FormlyMaterialModule
  ],
  declarations: [SignupPage],
  providers: [{
    provide: FORMLY_CONFIG,
    multi: true,
    useFactory: registerValidationMessages,
    deps: [TranslocoService],
  }]
})
export class SignupPageModule { }
