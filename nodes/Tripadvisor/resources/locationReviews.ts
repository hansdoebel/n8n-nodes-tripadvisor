import type { INodeProperties } from 'n8n-workflow';

import https from 'https';

export async function getLocationReviews(
	locationId: string,
	apiKey: string,
	language: string,
	limit: number,
	offset: number,
): Promise<any> {
	let url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/reviews?key=${apiKey}`;

	if (language) {
		url += `&language=${language}`;
	}

	if (limit) {
		url += `&limit=${limit}`;
	}

	if (offset) {
		url += `&offset=${offset}`;
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

export const locationReviewsFields: INodeProperties[] = [
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
				resource: ['locationReviews'],
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
				resource: ['locationReviews'],
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
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: '',
				description: 'The index of the first result',
			},
		],
	},
];
