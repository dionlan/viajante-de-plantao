// app/api/latam/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import os from 'os';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, miles: 0, message: 'Usuário e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // Criar script Python temporário
        const pythonScript = `
import os
import time
import sys
import json
import re
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

class LatamMilesScraper:
    def __init__(self, headless: bool = True):
        if os.name == 'nt':
            self.chrome_path = "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe"
        else:
            self.chrome_path = "/usr/bin/google-chrome"
        
        self.automation_profile_path = os.path.join(
            os.environ.get("USERPROFILE", os.environ.get("HOME", "")),
            "AppData", "Local", "Google", "Chrome", "User Data", "Default")
        
        self.chrome_options = self.configure_chrome(headless)
        self.driver = None
        self.wait = None

    def configure_chrome(self, headless: bool):
        options = Options()
        if os.path.exists(self.chrome_path):
            options.binary_location = self.chrome_path

        os.makedirs(self.automation_profile_path, exist_ok=True)
        
        options.add_argument(f"--user-data-dir={self.automation_profile_path}")
        options.add_argument("--profile-directory=Default")
        options.add_argument("--start-maximized")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_experimental_option("excludeSwitches", ["enable-automation", "enable-logging"])
        options.add_experimental_option("useAutomationExtension", False)
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--remote-debugging-port=0")
        
        if headless:
            options.add_argument("--headless=new")
        
        options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
        prefs = {
            "profile.default_content_setting_values.notifications": 2,
            "profile.default_content_setting_values.images": 1,
            "profile.default_content_setting_values.cookies": 1,
            "profile.default_content_setting_values.javascript": 1,
        }
        options.add_experimental_option("prefs", prefs)
        
        return options

    def init_driver(self):
        try:
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=self.chrome_options)
            
            self.driver.maximize_window()
            
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            self.wait = WebDriverWait(self.driver, 15)
            return True
        except Exception as e:
            print(f"Erro ao inicializar WebDriver: {e}")
            return False

    def is_user_logged_in(self):
        try:
            print("Verificando estado de login...")
            
            try:
                logout_elements = self.driver.find_elements(By.XPATH, "//a[contains(@href, '/logout')]")
                if logout_elements:
                    for element in logout_elements:
                        if element.is_displayed():
                            print("USUARIO LOGADO: Encontrado href='/logout' no menu")
                            return True
            except NoSuchElementException:
                pass
            
            user_menu_indicators = [
                "//*[contains(text(), 'Minhas Viagens')]",
                "//*[contains(text(), 'My Trips')]",
                "//*[contains(@class, 'user-menu')]",
                "//*[contains(@class, 'profile')]",
                "//*[contains(text(), 'Minha Conta')]",
                "//*[contains(text(), 'My Account')]",
                "//button[contains(text(), 'Sair')]",
                "//button[contains(text(), 'Logout')]",
            ]
            
            for selector in user_menu_indicators:
                try:
                    element = self.driver.find_element(By.XPATH, selector)
                    if element and element.is_displayed():
                        print(f"USUARIO LOGADO: Encontrado elemento '{selector}'")
                        return True
                except NoSuchElementException:
                    continue
            
            login_form_indicators = [
                "//input[@id='form-input--alias']",
                "//input[@type='email']",
                "//input[@type='password']",
                "//button[contains(text(), 'Entrar')]",
                "//button[contains(text(), 'Login')]",
                "//button[contains(text(), 'Sign in')]",
            ]
            
            for selector in login_form_indicators:
                try:
                    element = self.driver.find_element(By.XPATH, selector)
                    if element and element.is_displayed():
                        print(f"USUARIO NAO LOGADO: Encontrado formulario de login")
                        return False
                except NoSuchElementException:
                    continue
            
            print("Estado de login indeterminado")
            return False
            
        except Exception as e:
            print(f"Erro ao verificar login: {e}")
            return False

    def extract_miles_balance(self):
        try:
            print("Tentando extrair saldo de milhas...")
            
            time.sleep(3)
            
            miles_selectors = [
                "//p[contains(text(), 'Saldo total:')]",
                "//*[contains(text(), 'Saldo total')]",
                "//*[contains(text(), 'milhas')]",
                "//*[contains(@class, 'balance')]",
                "//*[contains(@class, 'miles')]",
                "//*[contains(@class, 'points')]",
            ]
            
            for selector in miles_selectors:
                try:
                    print(f"Procurando por: {selector}")
                    element = self.wait.until(EC.presence_of_element_located((By.XPATH, selector)))
                    if element:
                        miles_text = element.text
                        print(f"Texto encontrado: {miles_text}")
                        
                        miles_match = re.search(r'(\\d+(?:\\.\\d+)*)', miles_text)
                        if miles_match:
                            miles_balance = int(miles_match.group(1).replace('.', ''))
                            print(f"Saldo de milhas extraido: {miles_balance}")
                            return miles_balance
                        else:
                            print("Nenhum numero encontrado no texto")
                except TimeoutException:
                    print(f"Timeout com seletor: {selector}")
                    continue
                except Exception as e:
                    print(f"Erro com seletor {selector}: {e}")
                    continue
            
            print("Nao foi possivel encontrar saldo de milhas")
            return 0
            
        except Exception as e:
            print(f"Erro ao extrair milhas: {e}")
            return 0

    def enter_username(self, username: str) -> bool:
        try:
            print("Preenchendo usuario...")
            
            username_field = self.wait.until(
                EC.presence_of_element_located((By.ID, "form-input--alias"))
            )
            username_field.clear()
            username_field.send_keys(username)
            
            continue_button = self.wait.until(
                EC.element_to_be_clickable((By.ID, "primary-button"))
            )
            continue_button.click()
            
            time.sleep(2)
            return True
            
        except Exception as e:
            print(f"Erro ao preencher usuario: {e}")
            return False

    def enter_password(self, password: str) -> bool:
        try:
            print("Preenchendo senha...")
            
            password_field = self.wait.until(
                EC.presence_of_element_located((By.ID, "form-input--password"))
            )
            password_field.clear()
            password_field.send_keys(password)
            
            login_button = self.wait.until(
                EC.element_to_be_clickable((By.ID, "primary-button"))
            )
            login_button.click()
            
            time.sleep(3)
            return True
            
        except Exception as e:
            print(f"Erro ao preencher senha: {e}")
            return False

    def get_miles_with_smart_login(self, username: str, password: str) -> int:
        try:
            print("Iniciando processo LATAM com verificacao de login...")
            
            if not self.init_driver():
                return 0
            
            print("Acessando pagina da conta diretamente...")
            self.driver.get("https://latampass.com/myaccount")
            time.sleep(4)
            
            if self.is_user_logged_in():
                print("Usuario ja esta logado - extraindo milhas diretamente")
                miles_balance = self.extract_miles_balance()
                if miles_balance > 0:
                    print(f"Sucesso: {miles_balance} milhas obtidas sem login")
                    self.driver.quit()
                    return miles_balance
                else:
                    print("Usuario logado mas nao foi possivel extrair milhas")
            
            print("Usuario nao logado - iniciando processo de autenticacao...")
            
            self.driver.get("https://latampass.com/myaccount")
            time.sleep(3)
            
            if not self.enter_username(username):
                print("Falha na etapa do usuario")
                self.driver.quit()
                return 0
            
            if not self.enter_password(password):
                print("Falha na etapa da senha")
                self.driver.quit()
                return 0
            
            time.sleep(3)
            if self.is_user_logged_in():
                print("Login realizado com sucesso")
                
                self.driver.get("https://latampass.latam.com/en_br/myaccount")
                time.sleep(3)
                
                miles_balance = self.extract_miles_balance()
                self.driver.quit()
                return miles_balance
            else:
                print("Falha no login - credenciais invalidas")
                self.driver.quit()
                return 0
            
        except Exception as e:
            print(f"Erro no processo principal: {e}")
            if self.driver:
                self.driver.quit()
            return 0

if __name__ == "__main__":
    username = "${username}"
    password = "${password}"
    
    print("=" * 60)
    print("INICIANDO SCRAPER LATAM PASS - VERIFICACAO DE LOGIN")
    print("=" * 60)
    
    scraper = LatamMilesScraper(headless=False)
    miles_balance = scraper.get_miles_with_smart_login(username, password)
    
    result = {
        "success": True,
        "miles": miles_balance,
        "message": f"{miles_balance:,} milhas obtidas com sucesso".replace(",", ".")
    }
    
    print("=" * 60)
    print("RESULTADO FINAL:")
    print(json.dumps(result, indent=2))
    print("=" * 60)
    
    print(json.dumps(result))
`;

        // Substituir placeholders
        const scriptContent = pythonScript
            .replace('${username}', username.replace(/"/g, '\\"'))
            .replace('${password}', password.replace(/"/g, '\\"'));

        // Criar arquivo temporário
        const tempDir = os.tmpdir();
        const scriptPath = join(tempDir, `latam_scraper_${Date.now()}.py`);

        writeFileSync(scriptPath, scriptContent);
        console.log(`📁 Script criado em: ${scriptPath}`);

        // Executar script Python
        const result = await new Promise((resolve) => {
            let output = '';
            let errorOutput = '';

            console.log('Executando script Python...');

            const pythonProcess = spawn('py', [scriptPath]);

            pythonProcess.stdout.on('data', (data) => {
                const text = data.toString();
                output += text;
                console.log('Python stdout:', text);
            });

            pythonProcess.stderr.on('data', (data) => {
                const text = data.toString();
                errorOutput += text;
                console.error('Python stderr:', text);
            });

            pythonProcess.on('close', (code) => {
                console.log(`Processo Python finalizado com codigo: ${code}`);

                try {
                    // ESTRATÉGIA SIMPLES: Buscar a última linha que é JSON puro
                    const lines = output.split('\n').map(line => line.trim());
                    const jsonLines = lines.filter(line =>
                        line.startsWith('{') && line.endsWith('}') &&
                        line.includes('"success"') &&
                        line.includes('"miles"') &&
                        line.includes('"message"')
                    );

                    if (jsonLines.length > 0) {
                        // Pegar o último JSON encontrado (deve ser o resultado final)
                        const lastJson = jsonLines[jsonLines.length - 1];
                        console.log('JSON encontrado:', lastJson);
                        const parsedResult = JSON.parse(lastJson);
                        console.log('Resultado parseado:', parsedResult);
                        resolve(parsedResult);
                    } else {
                        // Fallback para quando não encontrar JSON
                        console.log('Nenhum JSON valido encontrado, analisando output...');

                        if (output.includes('milhas obtidas com sucesso')) {
                            resolve({
                                success: true,
                                miles: 0,
                                message: 'Processo concluido com sucesso'
                            });
                        } else {
                            resolve({
                                success: false,
                                miles: 0,
                                message: 'Falha no processo de autenticacao'
                            });
                        }
                    }
                } catch (parseError) {
                    console.error('Erro ao parsear JSON:', parseError);
                    resolve({
                        success: false,
                        miles: 0,
                        message: 'Erro no processamento dos dados'
                    });
                }

                // Limpar arquivo temporário
                try {
                    unlinkSync(scriptPath);
                    console.log('Arquivo temporario removido');
                } catch (cleanupError) {
                    console.error('Erro ao limpar arquivo:', cleanupError);
                }
            });

            // Timeout de 3 minutos
            setTimeout(() => {
                pythonProcess.kill();
                console.log('Timeout do processo Python');
                resolve({
                    success: false,
                    miles: 0,
                    message: 'Timeout: O processo demorou muito para responder.'
                });
            }, 180000);

        });

        return NextResponse.json(result);

    } catch (error) {
        console.error('💥 Erro na API:', error);
        return NextResponse.json(
            {
                success: false,
                miles: 0,
                message: 'Erro interno do servidor. Tente novamente mais tarde.'
            },
            { status: 500 }
        );
    }
}

// Adicionar método OPTIONS para CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}