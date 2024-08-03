import {FormControl} from '@angular/forms';

export interface SignInFormGroup {
    email: FormControl<string>,
    password: FormControl<string>,
    remember: FormControl<boolean>,
}
