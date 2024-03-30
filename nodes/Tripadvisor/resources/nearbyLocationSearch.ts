import type { INodeProperties } from 'n8n-workflow';

import https from 'https';

export async function getNearbyLocationSearch(
	apiKey: string,
	latLong: string,
	category: string,
	phone: string,
	address: string,
	radius: string,
	radiusUnit: string,
	language: string,
): Promise<any> {
	let url = `https://api.content.tripadvisor.com/api/v1/location/nearby_search?key=${apiKey}`;

	let queryParams = [];
	queryParams.push(`latlng=${encodeURIComponent(latLong)}`);

	if (category) {
		queryParams.push(`category=${encodeURIComponent(category)}`);
	}

	if (phone) {
		queryParams.push(`phone=${encodeURIComponent(phone)}`);
	}

	if (address) {
		queryParams.push(`address=${encodeURIComponent(address)}`);
	}

	if (radius) {
		queryParams.push(`radius=${encodeURIComponent(radius)}`);
	}

	if (radiusUnit) {
		queryParams.push(`unit=${encodeURIComponent(radiusUnit)}`);
	}

	if (language) {
		queryParams.push(`language=${encodeURIComponent(language)}`);
	}

	url += `?${queryParams.join('&')}`;

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

export const nearbyLocationSearchFields: INodeProperties[] = [
	{
		displayName: 'Latitude/Longitude',
		name: 'latLong',
		type: 'string',
		default: '',
		required: true,
		description: 'Latitude/Longitude pair to scope down the search around a specifc point - eg. "42.3455,-71.10767".',
		displayOptions: {
			show: {
				resource: ['nearbyLocationSearch'],
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
				resource: ['nearbyLocationSearch'],
			},
		},
		options: [
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Filters result set based on property type. Valid options are "hotels", "attractions", "restaurants", and "geos".',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description:
					'Phone number to filter the search results by (this can be in any format with spaces and dashes but without the "+" sign at the beginning)',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Address to filter the search results by',
			},
			{
				displayName: 'Radius',
				name: 'radius',
				type: 'string',
				default: '',
				description: 'Length of the radius from the provided latitude/longitude pair to filter results',
			},
			{
				displayName: 'Radius Unit',
				name: 'radiusUnit',
				type: 'string',
				default: '',
				description: 'Unit for length of the radius. Valid options are "km", "mi", "m" (km=kilometers, mi=miles, m=meters).',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'The language in which to return results (e.g. "en" for English or "es" for Spanish) from the list of our Supported Languages',
			},
		],
	},
];
