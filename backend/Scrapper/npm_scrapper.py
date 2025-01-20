import requests
import json
from datetime import datetime, timedelta
import time
from typing import Dict, Any, Optional
import logging
class NPM_Scraper:
    
    def __init__(self):
        self.session = requests.Session()
        self.registry_base_url = "https://registry.npmjs.org"
        self.unpkg_url = "https://unpkg.com"
        self.downloads_api_url = "https://api.npmjs.org/versions"
        self.session.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"})
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        
    def get_metaData(self,package_name:str)->Optional[Dict[str,Any]]:
        try:
            url = f"{self.registry_base_url}/{package_name}"
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as errh:
            self.logger.error(f"HTTP error occurred: {errh}")
            return None
    def get_download_stats(self, package_name: str) -> Dict[str, Any]:
      
        try:
            # Get last month's downloads
            end_date = datetime.now()
            start_date = end_date - timedelta(days=30)
            week_url = f"{self.downloads_api_url}/{package_name}/last-week"
            
            point_response = self.session.get(week_url)

            point_response.raise_for_status()
            
            return {
                'last_week': point_response.json(),
            }
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error fetching download stats for {package_name}: {str(e)}")
            return {'last_week': None, 'daily_downloads': None}
        
    def get_package_json(self, package_name: str, version: str = 'latest') -> Optional[Dict[str, Any]]:
        try:
            url = f"{self.unpkg_url}/{package_name}@{version}/package.json"
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error fetching package.json for {package_name}: {str(e)}")
            return None
    
    def get_package_lock(self, package_name: str, version: str = 'latest') -> Optional[Dict[str, Any]]:
        try:
            url = f"{self.unpkg_url}/{package_name}@{version}/package-lock.json"
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            self.logger.debug(f"No package-lock.json found for {package_name}: {str(e)}")
            return None   
    
    def collect_package_data(self, package_name: str) -> Dict[str, Any]:
        self.logger.info(f"Collecting data for package: {package_name}")
        
        time.sleep(1)
        
        package_data = {
            'name': package_name,
            'timestamp': datetime.now().isoformat(),
        }

        metadata = self.get_metaData(package_name)
        if metadata:
            package_data.update({
                'license': metadata.get('license'),
                'description': metadata.get('description'),
                'keywords': metadata.get('keywords', []),
                'versions': list(metadata.get('versions', {}).keys()),
                'maintainers': metadata.get('maintainers', []),
                'latest_version': metadata.get('dist-tags', {}).get('latest')
            })

        download_stats = self.get_download_stats(package_name)
        package_data['download_stats'] = download_stats

        package_json = self.get_package_json(package_name)
        if package_json:
            package_data['package_json'] = package_json

        package_lock = self.get_package_lock(package_name)
        if package_lock:
            package_data['package_lock'] = package_lock

        return package_data
    
    def save_to_file(self, data: Dict[str, Any], filename: str):
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            self.logger.info(f"Data saved to {filename}")
        except IOError as e:
            self.logger.error(f"Error saving data to {filename}: {str(e)}")
        
scraper = NPM_Scraper()


packages = ['react', 'express']
    
for package_name in packages:
    data = scraper.collect_package_data(package_name)
    scraper.save_to_file(data, f"{package_name}_data.json")
       