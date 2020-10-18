import axios from 'axios';

export const HTTP = axios.create( {
	// baseURL: 'http://localhost:5180'
  baseURL: '/crm'
} );
