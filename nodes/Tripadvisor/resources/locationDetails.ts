import type { INodeProperties } from 'n8n-workflow';

import https from 'https';

export async function getLocationDetails(
	locationId: string,
	apiKey: string,
	language: string,
	currency: string,
): Promise<any> {
	let url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?key=${apiKey}`;

	if (language) {
		url += `&language=${language}`;
	}

	if (currency) {
		url += `&currency=${currency}`;
	}

	return new Promise((resolve, reject) => {
		const options = {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		};

		const req = https.request(url, options, (response) => {
			let data = '';

			response.on('data', (chunk) => {
				data += chunk;
			});

			response.on('end', () => {
				resolve(JSON.parse(data));
			});
		});

		req.on('error', (error) => {
			reject(error);
		});

		req.end();
	});
}

export const locationDetailsFields: INodeProperties[] = [
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		default: '',
		required: true,
		description:
			'A unique identifier for a location on Tripadvisor. The location ID can be obtained using the Location Search.',
		displayOptions: {
			show: {
				resource: ['locationDetails'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['locationDetails'],
			},
		},
		options: [
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'The language in which to return results (e.g. "en" for English or "es" for Spanish) from the list of our Supported Languages',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'The currency code to use for request and response (should follow ISO 4217)',
			},
		],
	},
];
