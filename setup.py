"""
setup.py — installeur d'environnement pour l'extension Mesh Repair (TypeScript).

Appelé par Modly avec :
    python setup.py '<json_args>'

où json_args contient :
    {
        "python_exe": "/usr/bin/python3",   # interpréteur Python (non utilisé)
        "ext_dir":    "/path/to/extension"  # répertoire de l'extension
    }
"""

import json
import os
import subprocess
import sys


def log(msg):
    print(msg, flush=True)


def main():
    if len(sys.argv) < 2:
        log("Usage : python setup.py '<json>'")
        sys.exit(1)

    try:
        args = json.loads(sys.argv[1])
    except Exception as exc:
        log(f"Erreur de parsing des arguments JSON : {exc}")
        sys.exit(1)

    ext_dir = args.get("ext_dir", os.path.dirname(os.path.abspath(__file__)))
    log(f"Extension : {ext_dir}")

    # Sur Windows, npm/npx sont des scripts .cmd — shell=True est requis.
    shell = sys.platform == "win32"

    # 1. npm install
    log("Installation des dépendances npm…")
    try:
        subprocess.check_call(["npm", "install", "--prefer-offline"],
                              cwd=ext_dir, shell=shell)
        log("Dépendances installées.")
    except subprocess.CalledProcessError as exc:
        log(f"Erreur lors de npm install : {exc}")
        sys.exit(1)

    # 2. Compilation TypeScript
    log("Compilation TypeScript…")
    try:
        subprocess.check_call(["npx", "tsc"], cwd=ext_dir, shell=shell)
        log("Compilation terminée — generator.js prêt.")
    except subprocess.CalledProcessError as exc:
        log(f"Erreur lors de la compilation TypeScript : {exc}")
        sys.exit(1)

    log("Setup terminé avec succès.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        log(f"Erreur inattendue : {exc}")
        sys.exit(1)
