import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TripadvisorApi implements ICredentialType {
	name = 'tripadvisorApi';
	displayName = 'Tripadvisor API';
	documentationUrl = 'https://tripadvisor-content-api.readme.io/reference/overview';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
