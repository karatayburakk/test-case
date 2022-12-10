import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

class ValidationResult {
	payload: any;
	error: any;
}

export async function validateAndConvert(classToConvert: any, body: string) {
	const result = new ValidationResult();
	result.payload = plainToClass(classToConvert, body);
	await validate(result.payload, { whitelist: true }).then(errors => {
		// errors is an array of validation errors
		if (errors.length > 0) {
			// eslint-disable-next-line @typescript-eslint/no-array-constructor
			let errorTexts = Array();
			for (const errorItem of errors) {
				errorTexts = errorTexts.concat(errorItem.constraints);
			}
			result.error = errorTexts;
			return result;
		}
	});
	return result;
}
