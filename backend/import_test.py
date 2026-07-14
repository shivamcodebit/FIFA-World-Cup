import importlib
try:
    importlib.import_module('app.main')
    print('OK: app.main imported')
except Exception as e:
    print('ERROR', type(e).__name__, e)
    import traceback
    traceback.print_exc()
