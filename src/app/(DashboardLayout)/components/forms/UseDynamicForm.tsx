
import React, { useRef } from 'react';

import {Grid, Stack, Box, Button} from '@mui/material';

import DashboardCard from '@/app/(DashboardLayout)//components/shared/DashboardCard';
import DynamicForm, { DynamicFormRef } from './DynamicForm';

import { MinLengthValidation } from '../forms/validations/MinLengthValidation';
import { MaxLengthValidation } from '../forms/validations/MaxLengthValidation';
import { NameValidation } from '../forms/validations/NameValidation';

const UseDynamicForm = () => {
	const form1Ref = useRef<DynamicFormRef>(null);
	const form2Ref = useRef<DynamicFormRef>(null);

	const fields1 = [
		{
			name: "text_required1",
			label: "Text Required",
			required: true,
			validator: [MinLengthValidation(3), MaxLengthValidation(20), NameValidation()],
		},
		{
			name: "text_unrequired1",
			label: "Text Unequired",
			required: false,
			validator: [MinLengthValidation(3), MaxLengthValidation(20), NameValidation()],
		},
		{
			name: "dropdown1",
			label: "Dropdown",
			type: "dropdown",
			required: true,
		},
	];

	const fields2 = [
		{
			name: "code2",
			label: "Code",
			required: true,
			validator: [MinLengthValidation(3), MaxLengthValidation(20), NameValidation()],
		},
		{
			name: "name2",
			label: "Name",
			required: true,
			validator: [MinLengthValidation(3), MaxLengthValidation(20), NameValidation()],
		},
		{
			name: "desc2",
			label: "Description",
			required: false,
			validator: [MinLengthValidation(3), MaxLengthValidation(20), NameValidation()],
		},
	];

	const handleSubmitButtonClick = () => {
		const isForm1Valid = form1Ref.current?.validateAndSubmit() || false;
		const isForm2Valid = form2Ref.current?.validateAndSubmit() || false;

		console.log("isForm1Valid:", isForm1Valid);
		console.log("isForm2Valid:", isForm2Valid);
		if (isForm1Valid && isForm2Valid) {
			const form1Data = form1Ref.current?.getData();
			const form2Data = form2Ref.current?.getData();
			const mergedData = { ...form1Data, ...form2Data };
			console.log("Merged Form Data:", mergedData);
		}
	};

    return (
		
        <Grid container spacing={3}>
          	<Grid item xs={12} lg={6}>
				<DashboardCard title="Edit" subtitle="Perjalanan KA">
					<Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
						<DynamicForm
							ref={form1Ref}
							fields={fields1}
						/>
					</Box>
				</DashboardCard>
			</Grid>
          	<Grid item xs={12} lg={6}>
				<DashboardCard title="Edit Detail" subtitle="Perjalanan KA - 1234B">
					<Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
						<DynamicForm
							ref={form2Ref}
							fields={fields2}
						/>
					</Box>
				</DashboardCard>
			</Grid>
			<Grid item xs={12} lg={12}>
				<Stack spacing={2} direction="row" display="flex" justifyContent="flex-end">
					<Button size="large" variant="contained" color="primary" onClick={handleSubmitButtonClick}>Submit</Button>
					<Button size="large" variant="outlined" color="error">Cancel</Button>
				</Stack>
			</Grid>
		</Grid>
    );
};

export default UseDynamicForm;
