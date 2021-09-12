import React from 'react';
import { Page, Input, Text, Checkbox, Grid, Divider, Card, Toggle, Tooltip } from '@geist-ui/react';
import _ from 'lodash';

const roots = [ 'meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec', 'undec', 'dodec' ];
const alkane = roots.map(x => x + 'ane');
const prefixes = [ '', 'di', 'tri', 'tetra' ];
const commons = [ 'fluoro', 'chloro', 'bromo', 'iodo', 'nitro', 'isopropyl', 'sec-butyl', 'isobutyl', 'tert-butyl' ];
for (let i = prefixes.length; i < roots.length; ++i)
	prefixes[i] = roots[i] + 'a';
const substituents = roots.map(x => x + 'yl');
for (let i = substituents.length; i < roots.length + commons.length; ++i)
	substituents[i] = commons[i - roots.length];
let maps = {};
for (const sub of substituents) {
	let map = {};
	prefixes.forEach((val, idx) => map[(idx + 1).toString()] = `-${val + sub}-`);
	map[''] = map['0'] = '';
	maps[sub] = map;
}

const Calculator = () => {
	const [ chain, setChain ] = React.useState('');
	const [ cyclo, setCyclo ] = React.useState(false);
	const [ advanced, setAdvanced ] = React.useState(false);
	const [ inputs, setInputs ] = React.useState({});
	
	const cb_factory = (sub) => {
		return (e) => {
			let new_inputs = _.cloneDeep(inputs);
			new_inputs[sub] = e.target.value;
			setInputs(new_inputs);
		};
	};
	
	let name = '';
	for (const sub of [...substituents].sort()) {
		const input = inputs[sub]?.replace(/\s/g, ',');
		const placements = input?.split(',').filter(x => x !== '' && +x > 0 && Number.isInteger(+x)) || [];
		placements.sort((a, b) => (+a) - (+b));
		name += `${placements.join(',')}${maps[sub][placements.length] || ''}`;
	}
	name += cyclo ? '-cyclo' : '';
	name += alkane[chain - 1] || '';
	const last_dash = name.lastIndexOf('-');
	name = name.substring(0, last_dash) + name.substring(last_dash + 1);
	
	return (
		<>
			<Grid.Container gap={0.75}>
				<Grid xs={18}>
					<h2>Alkane Namer</h2>
				</Grid>
				
				<Grid justify='flex-end' alignItems='center' xs={6}>
					<Tooltip text='advanced mode'>
						<Toggle checked={advanced} onChange={e => setAdvanced(x => !x)} />
					</Tooltip>
				</Grid>
				
				<Grid xs={16}>
					Longest carbon chain?
				</Grid>
				
				<Grid xs={8}>
					<Input htmlType='number' min={0} step={1} onChange={e => setChain(e.target.value)} width='100%' />
				</Grid>
				
				<Grid xs={16}>
					Is it a cyclo chain?
				</Grid>
				
				<Grid alignItems='center' xs={8}>
					<Checkbox checked={cyclo} onChange={e => setCyclo(x => !x)} />
				</Grid>
				
				{
					substituents.map((sub, idx) => {
						if (!advanced && idx > 4)
							return;
						const show_substituent_size = idx < roots.length;
						const show_divider = idx === roots.length - 1;
						return (
							<>
								
								<Grid xs={16}>
									{`Where are the ${sub} groups?`}
									{show_substituent_size ? ` (${idx + 1})` : ''}
								</Grid>
								
								<Grid xs={8}>
									<Input onChange={cb_factory(sub)} width='100%' />
								</Grid>
								
								{ show_divider ?
									<Grid xs={24}>
										<Card width='100%' style={{'border': 0}}>
											<Divider />
										</Card>
									</Grid> : null
								}
							</>
						)}
					)
				}
				
				<Grid justify='center' xs={24}>
					{ name }
				</Grid>
			</Grid.Container>
		</>
	);
};

export default () => {
	return (
		<Page width='700px'>
			<Calculator />
		</Page>
	);
};