import redshift_connector
from datetime import datetime


def main():
    
    # Connect to Redshift
    print('Start connecting...')
    conn = redshift_connector.connect(
        host='',
        port=5439,
        database='dev',
        user='',
        password=''
    )
    print('Connected to Redshift')

    # Create a Cursor object
    cursor = conn.cursor()

    # Get data from Redshift
    cursor.execute('select * from webapp.access_log')
    result = cursor.fetchall()
    print(result)

    # Upload data to Redshift
    # query = f"""
    # insert into webapp.access_log (ip_address, path, created_at)
    # values ('0.0.0.0', '/', '{datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")}');
    # """
    # cursor.execute(query)
    
    # Get data from Redshift again
    cursor.execute('select * from webapp.access_log')
    result = cursor.fetchall()
    print(result)


if __name__ == '__main__':
    main()
