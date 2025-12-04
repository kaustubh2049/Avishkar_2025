"""
Test script to verify the ML model is working correctly
"""
import requests
import sys
import os

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# API endpoint
API_URL = "http://localhost:5000"

def test_health_check():
    """Test if API is running"""
    print("\n" + "="*50)
    print("TEST 1: Health Check")
    print("="*50)
    try:
        response = requests.get(f"{API_URL}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ API is running")
            print(f"✓ Model loaded: {data.get('model_loaded', False)}")
            return True
        else:
            print(f"✗ API returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to API. Is the server running?")
        print("  Run: python server.py")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_model_info():
    """Test model information endpoint"""
    print("\n" + "="*50)
    print("TEST 2: Model Information")
    print("="*50)
    try:
        response = requests.get(f"{API_URL}/model-info")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Model loaded: {data.get('model_loaded', False)}")
            print(f"✓ Input shape: {data.get('input_shape', 'N/A')}")
            print(f"✓ Output shape: {data.get('output_shape', 'N/A')}")
            print(f"✓ Classes: {data.get('classes', [])}")
            print(f"✓ Number of classes: {data.get('num_classes', 0)}")
            return True
        else:
            print(f"✗ Failed with status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_prediction_with_sample():
    """Test prediction with a sample image (if available)"""
    print("\n" + "="*50)
    print("TEST 3: Prediction Test")
    print("="*50)
    
    # Check if there's a test image
    test_images = [
        "test_image.jpg",
        "test_image.png",
        "sample.jpg",
        "sample.png"
    ]
    
    test_image = None
    for img in test_images:
        if os.path.exists(img):
            test_image = img
            break
    
    if not test_image:
        print("⚠ No test image found")
        print("  To test predictions, place an image file named:")
        print("  - test_image.jpg or test_image.png")
        print("  in the backend directory")
        return None
    
    try:
        print(f"Using test image: {test_image}")
        with open(test_image, 'rb') as f:
            files = {'file': f}
            response = requests.post(f"{API_URL}/predict", files=files)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Prediction successful")
            print(f"✓ Disease: {data.get('prediction', 'N/A')}")
            print(f"✓ Confidence: {data.get('confidence', 0)}%")
            return True
        else:
            print(f"✗ Prediction failed with status code: {response.status_code}")
            print(f"  Error: {response.json().get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_error_handling():
    """Test error handling"""
    print("\n" + "="*50)
    print("TEST 4: Error Handling")
    print("="*50)
    
    try:
        # Test with no file
        response = requests.post(f"{API_URL}/predict")
        if response.status_code == 400:
            print("✓ Correctly handles missing file")
        else:
            print(f"⚠ Unexpected status code: {response.status_code}")
        
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*50)
    print("AgriVeda ML Model Test Suite")
    print("="*50)
    
    results = []
    
    # Run tests
    results.append(("Health Check", test_health_check()))
    results.append(("Model Info", test_model_info()))
    results.append(("Prediction", test_prediction_with_sample()))
    results.append(("Error Handling", test_error_handling()))
    
    # Summary
    print("\n" + "="*50)
    print("TEST SUMMARY")
    print("="*50)
    
    passed = sum(1 for _, result in results if result is True)
    failed = sum(1 for _, result in results if result is False)
    skipped = sum(1 for _, result in results if result is None)
    total = len(results)
    
    for test_name, result in results:
        if result is True:
            status = "✓ PASS"
        elif result is False:
            status = "✗ FAIL"
        else:
            status = "⚠ SKIP"
        print(f"{test_name:20s}: {status}")
    
    print(f"\nTotal: {total} | Passed: {passed} | Failed: {failed} | Skipped: {skipped}")
    
    if failed == 0:
        print("\n✓ All tests passed! Model is working correctly.")
        return 0
    else:
        print(f"\n✗ {failed} test(s) failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
