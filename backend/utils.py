from modconfig import Config
import os


def load_configs():
    env = os.environ.get("ENV", "develop")
    cfg = Config(f"backend.config.{env}")
    if os.path.exists("backend/config/local.py") and not env == "tests":
        cfg.update_from_modules("backend.config.local")

    return cfg
