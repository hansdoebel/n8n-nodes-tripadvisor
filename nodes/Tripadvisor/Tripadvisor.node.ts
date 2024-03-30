import {
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IExecuteFunctions,
} from 'n8n-workflow';

import {
	locationDetailsFields,
	getLocationDetails,
	locationPhotosFields,
	getLocationPhotos,
	locationReviewsFields,
	getLocationReviews,
	locationSearchFields,
	getLocationSearch,
	nearbyLocationSearchFields,
	getNearbyLocationSearch,
} from './resources';

export class Tripadvisor implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tripadvisor',
		name: 'tripadvisor',
		icon: 'file:tripadvisor.svg',
		group: ['Miscellaneous'],
		subtitle: '={{$parameter["resource"]}}',
		version: 1,
		description: 'Tripadvisor custom node for n8n',
		defaults: {
			name: 'Tripadvisor',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tripadvisorApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Location Detail',
						value: 'locationDetails',
					},
					{
						name: 'Location Photo',
						value: 'locationPhotos',
					},
					{
						name: 'Location Review',
						value: 'locationReviews',
					},
					{
						name: 'Location Search',
						value: 'locationSearch',
					},
					{
						name: 'Nearby Location Search',
						value: 'nearbyLocationSearch',
					},
				],
				default: 'locationDetails',
			},
			...locationDetailsFields,
			...locationPhotosFields,
			...locationReviewsFields,
			...locationSearchFields,
			...nearbyLocationSearchFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		const credentials = await this.getCredentials('tripadvisorApi');
		const apiKey = (await credentials).apiKey as string;

		let responseData: any;

		switch (resource) {
			case 'locationDetails':
				const locationIdDetails = this.getNodeParameter('locationId', 0) as string;
				const languageDetails = this.getNodeParameter('additionalFields.language', 0, '') as string;
				const currencyDetails = this.getNodeParameter('additionalFields.currency', 0, '') as string;

				responseData = await getLocationDetails(
					locationIdDetails,
					apiKey,
					languageDetails,
					currencyDetails,
				);
				break;

			case 'locationPhotos':
				const locationIdPhotos = this.getNodeParameter('locationId', 0) as string;
				const languagePhotos = this.getNodeParameter('additionalFields.language', 0, '') as string;
				const limitPhotos = this.getNodeParameter('additionalFields.limit', 0, '') as number;
				const offsetPhotos = this.getNodeParameter('additionalFields.offset', 0, '') as number;
				const sourcePhotos = this.getNodeParameter('additionalFields.source', 0, '') as number;

				responseData = await getLocationPhotos(
					locationIdPhotos,
					apiKey,
					languagePhotos,
					limitPhotos,
					offsetPhotos,
					sourcePhotos,
				);
				break;

			case 'locationReviews':
				const locationIdReviews = this.getNodeParameter('locationId', 0) as string;
				const languageReviews = this.getNodeParameter('additionalFields.language', 0, '') as string;
				const limitReviews = this.getNodeParameter('additionalFields.limit', 0, '') as number;
				const offsetReviews = this.getNodeParameter('additionalFields.offset', 0, '') as number;

				responseData = await getLocationReviews(
					locationIdReviews,
					apiKey,
					languageReviews,
					limitReviews,
					offsetReviews,
				);
				break;

			case 'locationSearch':
				const searchQuerySearch = this.getNodeParameter('searchQuery', 0) as string;
				const categorySearch = this.getNodeParameter('additionalFields.category', 0, '') as string;
				const phoneSearch = this.getNodeParameter('additionalFields.phone', 0, '') as string;
				const addressSearch = this.getNodeParameter('additionalFields.address', 0, '') as string;
				const latLongSearch = this.getNodeParameter('additionalFields.latLong', 0, '') as string;
				const radiusSearch = this.getNodeParameter('additionalFields.radius', 0, '') as string;
				const radiusUnitSearch = this.getNodeParameter(
					'additionalFields.radiusUnit',
					0,
					'',
				) as string;
				const languageSearch = this.getNodeParameter('additionalFields.language', 0, '') as string;

				responseData = await getLocationSearch(
					searchQuerySearch,
					apiKey,
					categorySearch,
					phoneSearch,
					addressSearch,
					latLongSearch,
					radiusSearch,
					radiusUnitSearch,
					languageSearch,
				);
				break;

			case 'nearbyLocationSearch':
				const latLongNearby = this.getNodeParameter('latLong', 0) as string;
				const categoryNearby = this.getNodeParameter('additionalFields.category', 0, '') as string;
				const phoneNearby = this.getNodeParameter('additionalFields.phone', 0, '') as string;
				const addressNearby = this.getNodeParameter('additionalFields.address', 0, '') as string;
				const radiusNearby = this.getNodeParameter('additionalFields.radius', 0, '') as string;
				const radiusUnitNearby = this.getNodeParameter(
					'additionalFields.radiusUnit',
					0,
					'',
				) as string;
				const languageNearby = this.getNodeParameter('additionalFields.language', 0, '') as string;

				responseData = await getNearbyLocationSearch(
					latLongNearby,
					apiKey,
					categoryNearby,
					phoneNearby,
					addressNearby,
					radiusNearby,
					radiusUnitNearby,
					languageNearby,
				);
				break;
		}

		return this.prepareOutputData([
			{
				json: responseData,
			},
		]);
	}
}
