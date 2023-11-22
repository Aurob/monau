import urllib.request

test_token = '''eyJhbGciOiJSUzI1NiIsImtpZCI6ImFlZTI5NTEzMjZhMzE2YWFiMzhjNjM2MzZkMjU5Yjg4ODE4YWEyNzQ5MTU2YzI5ZjdmOTg2MjI0OTAxNThkNmMifQ.eyJhdWQiOlsiYzRjYWFlMTI1YTlhMTQ1YmY2NjBkY2Q1ZmExMzlmMTUwMDhiOTc3YmIyNTA4MmM3MzcxNzYzZTI3NDMyZmUyNSJdLCJlbWFpbCI6InJvYmF1NkBnbWFpbC5jb20iLCJleHAiOjE2OTgyNjA0ODUsImlhdCI6MTY5ODI1OTU4NSwibmJmIjoxNjk4MjU5NTg1LCJpc3MiOiJodHRwczovL2F1ZGV2LmNsb3VkZmxhcmVhY2Nlc3MuY29tIiwidHlwZSI6ImFwcCIsImlkZW50aXR5X25vbmNlIjoicFZNYURhcTIzT2hseHJDRiIsInN1YiI6Ijc4N2MxYjE2LTk3ZjAtNTc4ZC1iOTNhLTFhNjIwYmU0MDE2ZiIsInBhdGhDb29raWUiOnRydWUsInBhdGhUZXh0IjoiL2xvZ2luIiwiY291bnRyeSI6IlVTIn0.g6N-7xADab-1NGEcxnc0vJPyAoHH8OfnGogJU1MpTxgaBkKzTiuB2RviXgOrToZhTxZTInXl6papYkshYtzKg8zaFKCHuhxQMTzcwtntniIC33tZXMbfmmD2sF5m2QgJdt6ZFoUPizOkhCZf0YFXWHbDdZ9xj34EZgA6kIr-9RW4iSHrzC4XFDA2PyzA_V8gKjNJ71HNSQRyf_BOLbrpp2t3jL4jM78iZRJBs9tw57qRQU-kQ8MIbWT01a9kg_UA4QgQ86cpfcLFPWDisJpcBsD1ilUNlyMxLpvsKupqBTVrTxW-13mLRh1zI7FFzaZTvoNH5J9v9z_fBnTKwtgbDA'''
url = 'https://audev.cloudflareaccess.com/cdn-cgi/access/get-identity'
#cookie: CF_Authorization=

req = urllib.request.Request(url)
req.add_header('cookie', 'CF_Authorization=' + test_token)

def default():
    with urllib.request.urlopen(req) as response:
        # return response.read().decode('utf-8')
        # resolve '"'utf-8' codec can't decode byte 0x8b in position 1: invalid start byte"'
        # return response.read().decode('utf-8', 'ignore')
        # try a different approach
        return response.read().decode('unicode_escape')