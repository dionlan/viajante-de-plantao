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
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

class LatamMilesScraper:
    def __init__(self, headless: bool = True):
        # Configurar caminhos baseados no sistema operacional
        if os.name == 'nt':  # Windows
            self.chrome_path = "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe"
        else:  # Linux/Mac
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
        """Inicializa o WebDriver de forma rápida e maximizada"""
        try:
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=self.chrome_options)
            
            # Garantir que está maximizado mesmo se a opção não funcionar
            self.driver.maximize_window()
            
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            self.wait = WebDriverWait(self.driver, 10)
            return True
        except Exception as e:
            print(f"Erro ao inicializar WebDriver: {e}")
            return False

    def extract_miles_balance(self):
        """Tenta extrair o saldo de milhas diretamente - ESTRATÉGIA PRINCIPAL"""
        try:
            print("Tentando extrair milhas diretamente...")
            
            # Seletores diretos para as milhas
            miles_selectors = [
                (By.XPATH, "//p[contains(text(), 'Saldo total:')]"),
                (By.XPATH, "//*[contains(text(), 'Saldo total')]"),
                (By.XPATH, "//*[contains(text(), 'milhas')]"),
            ]
            
            for by, selector in miles_selectors:
                try:
                    miles_element = self.wait.until(
                        EC.presence_of_element_located((by, selector))
                    )
                    if miles_element:
                        miles_text = miles_element.text
                        print(f"Texto encontrado: {miles_text}")
                        
                        # Extrair APENAS O NÚMERO das milhas
                        miles_match = re.search(r'(\d+(?:\.\d+)*)', miles_text)
                        if miles_match:
                            miles_balance = int(miles_match.group(1).replace('.', ''))
                            print(f"Saldo de milhas extraído: {miles_balance}")
                            return miles_balance
                        else:
                            # Se não encontrar número, retorna 0
                            print("Nenhum número encontrado no texto, retornando 0")
                            return 0
                except TimeoutException:
                    continue
            
            return 0
            
        except Exception as e:
            print(f"Erro ao extrair milhas: {e}")
            return 0

    def enter_username(self, username: str) -> bool:
        """Preenche o formulário de usuário de forma rápida"""
        try:
            print("Preenchendo usuário...")
            
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
            print(f"Erro ao preencher usuário: {e}")
            return False

    def enter_password(self, password: str) -> bool:
        """Preenche o formulário de senha de forma rápida"""
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

    def login_and_get_miles(self, username: str, password: str) -> int:
        """Processo otimizado: tenta milhas direto, se não faz login"""
        try:
            print("Iniciando processo LATAM...")
            
            # Inicializar driver
            if not self.init_driver():
                return 0
            
            # ESTRATÉGIA PRINCIPAL: Tentar acessar direto e buscar milhas
            print("Acessando página diretamente...")
            self.driver.get("https://latampass.com/myaccount")
            time.sleep(3)
            
            # Tentar extrair milhas imediatamente
            miles_balance = self.extract_miles_balance()
            if miles_balance is not None and miles_balance >= 0:
                print(f"Milhas obtidas diretamente: {miles_balance}")
                self.driver.quit()
                return miles_balance
            
            # ESTRATÉGIA SECUNDÁRIA: Fazer login
            print("Milhas não encontradas. Iniciando login...")
            
            # Primeira etapa: usuário
            if not self.enter_username(username):
                self.driver.quit()
                return 0
            
            # Segunda etapa: senha
            if not self.enter_password(password):
                self.driver.quit()
                return 0
            
            # Após login, tentar novamente extrair milhas
            time.sleep(3)
            self.driver.get("https://latampass.com/myaccount")
            time.sleep(2)
            
            miles_balance = self.extract_miles_balance()
            
            if miles_balance is not None and miles_balance >= 0:
                print(f"Milhas obtidas após login: {miles_balance}")
            else:
                print("Não foi possível obter milhas")
                miles_balance = 0
            
            self.driver.quit()
            return miles_balance if miles_balance is not None else 0
            
        except Exception as e:
            print(f"Erro no processo: {e}")
            if self.driver:
                self.driver.quit()
            return 0

# Execução principal
if __name__ == "__main__":
    username = "${username}"
    password = "${password}"
    
    print("Iniciando scraper LATAM...")
    scraper = LatamMilesScraper(headless=False)
    miles_balance = scraper.login_and_get_miles(username, password)
    
    # SEMPRE retornar JSON válido
    result = {
        "success": True if miles_balance >= 0 else False,
        "miles": miles_balance if miles_balance >= 0 else 0,
        "message": f"{miles_balance:,} milhas obtidas com sucesso".replace(",", ".") if miles_balance >= 0 else "❌ Não foi possível obter as milhas"
    }
    
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

            console.log('🐍 Executando script Python...');

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
                console.log(`🐍 Processo Python finalizado com código: ${code}`);
                console.log(`🐍 OUTPUT COMPLETO: ${output}`);

                try {
                    // Tentar extrair JSON da saída - método mais robusto
                    const jsonMatch = output.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const parsedResult = JSON.parse(jsonMatch[0]);
                        console.log('✅ Resultado parseado:', parsedResult);
                        resolve(parsedResult);
                    } else {
                        console.log('❌ Não foi possível encontrar JSON na saída, usando fallback');
                        // Fallback: tentar extrair número das milhas do output
                        const milesMatch = output.match(/SALDO DE MILHAS:?\s*(\d+)/i) ||
                            output.match(/milhas.*?(\d+)/i) ||
                            output.match(/Saldo.*?(\d+)/i);

                        if (milesMatch) {
                            const miles = parseInt(milesMatch[1]) || 0;
                            resolve({
                                success: true,
                                miles: miles,
                                message: `✅ ${miles.toLocaleString('pt-BR')} milhas obtidas com sucesso`
                            });
                        } else {
                            resolve({
                                success: false,
                                miles: 0,
                                message: 'Erro: Não foi possível processar a resposta do servidor LATAM'
                            });
                        }
                    }
                } catch (parseError) {
                    console.error('❌ Erro ao parsear JSON:', parseError);
                    resolve({
                        success: false,
                        miles: 0,
                        message: `Erro de comunicação: ${errorOutput || 'Verifique as credenciais'}`
                    });
                }

                // Limpar arquivo temporário
                try {
                    unlinkSync(scriptPath);
                    console.log('🧹 Arquivo temporário removido');
                } catch (cleanupError) {
                    console.error('Erro ao limpar arquivo:', cleanupError);
                }
            });

            // Timeout de 3 minutos
            setTimeout(() => {
                pythonProcess.kill();
                console.log('⏰ Timeout do processo Python');
                resolve({
                    success: false,
                    miles: 0,
                    message: 'Timeout: O processo demorou muito para responder. Tente novamente.'
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