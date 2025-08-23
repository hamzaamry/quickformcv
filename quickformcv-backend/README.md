to run the server :

activate venv by `.\venv\Scripts\Activate`

then run 

`uvicorn app.main:app --reload` or `python -m uvicorn app.main:app --reload`

to reset database run  : `python app.Database.reset-db.py`