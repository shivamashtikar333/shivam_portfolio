#!/usr/bin/env python3
"""
Backend API Test Suite for Portfolio Blog Integration
Tests the GET /api/blogs endpoint and existing endpoints
"""

import requests
import json
from typing import List, Dict, Any

# Base URL from frontend/.env
BASE_URL = "https://portfolio-flow-56.preview.emergentagent.com"

def print_test_header(test_name: str):
    """Print a formatted test header"""
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")

def print_result(passed: bool, message: str):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {message}")

def validate_blog_post_structure(post: Dict[str, Any]) -> tuple[bool, str]:
    """Validate that a blog post has all required fields"""
    required_fields = ["id", "title", "brief", "url", "slug"]
    optional_fields = ["publishedAt", "readTimeInMinutes", "tag", "coverImage"]
    
    # Check required fields
    for field in required_fields:
        if field not in post:
            return False, f"Missing required field: {field}"
        if not post[field]:
            return False, f"Required field '{field}' is empty"
    
    # Check optional fields exist (can be None)
    for field in optional_fields:
        if field not in post:
            return False, f"Missing optional field: {field}"
    
    return True, "All fields present"

def test_blogs_default():
    """Test 1: GET /api/blogs returns 200 with array of blog posts"""
    print_test_header("GET /api/blogs - Default Call")
    
    try:
        response = requests.get(f"{BASE_URL}/api/blogs", timeout=30)
        
        # Check status code
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        print_result(True, f"Status code: {response.status_code}")
        
        # Check response is JSON
        try:
            data = response.json()
        except json.JSONDecodeError as e:
            print_result(False, f"Response is not valid JSON: {e}")
            return False
        
        print_result(True, "Response is valid JSON")
        
        # Check response is an array
        if not isinstance(data, list):
            print_result(False, f"Expected array, got {type(data)}")
            return False
        
        print_result(True, f"Response is an array with {len(data)} items")
        
        # Check array is not empty
        if len(data) == 0:
            print_result(False, "Array is empty - expected at least 1 post")
            return False
        
        print_result(True, f"Array contains {len(data)} blog post(s)")
        
        # Validate structure of first post
        first_post = data[0]
        is_valid, message = validate_blog_post_structure(first_post)
        print_result(is_valid, f"First post structure: {message}")
        
        if is_valid:
            print(f"\nFirst post details:")
            print(f"  - ID: {first_post['id'][:50]}...")
            print(f"  - Title: {first_post['title']}")
            print(f"  - Brief: {first_post['brief'][:100]}...")
            print(f"  - URL: {first_post['url']}")
            print(f"  - Slug: {first_post['slug']}")
            print(f"  - Published: {first_post.get('publishedAt', 'N/A')}")
            print(f"  - Read Time: {first_post.get('readTimeInMinutes', 'N/A')} min")
            print(f"  - Tag: {first_post.get('tag', 'N/A')}")
            print(f"  - Cover Image: {'Yes' if first_post.get('coverImage') else 'No'}")
        
        # Check for the specific NextAuth RBAC article
        nextauth_article_found = False
        for post in data:
            if "Next.js Auth Simplified" in post.get("title", "") and "NextAuth" in post.get("title", ""):
                nextauth_article_found = True
                print_result(True, f"Found expected article: '{post['title']}'")
                break
        
        if not nextauth_article_found:
            print_result(False, "Expected article 'Next.js Auth Simplified: NextAuth with Role-Based Access' not found")
            print(f"Available articles: {[p['title'] for p in data]}")
            return False
        
        return True
        
    except requests.exceptions.RequestException as e:
        print_result(False, f"Request failed: {e}")
        return False
    except Exception as e:
        print_result(False, f"Unexpected error: {e}")
        return False

def test_blogs_refresh():
    """Test 2: GET /api/blogs?refresh=true bypasses cache"""
    print_test_header("GET /api/blogs?refresh=true")
    
    try:
        response = requests.get(f"{BASE_URL}/api/blogs?refresh=true", timeout=30)
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
        
        print_result(True, f"Status code: {response.status_code}")
        
        data = response.json()
        
        if not isinstance(data, list):
            print_result(False, f"Expected array, got {type(data)}")
            return False
        
        print_result(True, f"Response is an array with {len(data)} items")
        
        if len(data) == 0:
            print_result(False, "Array is empty")
            return False
        
        # Validate structure
        is_valid, message = validate_blog_post_structure(data[0])
        print_result(is_valid, f"Post structure: {message}")
        
        return is_valid
        
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

def test_blogs_custom_host():
    """Test 3: GET /api/blogs?host=engineering.hashnode.com"""
    print_test_header("GET /api/blogs?host=engineering.hashnode.com")
    
    try:
        response = requests.get(f"{BASE_URL}/api/blogs?host=engineering.hashnode.com", timeout=30)
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        print_result(True, f"Status code: {response.status_code}")
        
        data = response.json()
        
        if not isinstance(data, list):
            print_result(False, f"Expected array, got {type(data)}")
            return False
        
        print_result(True, f"Response is an array with {len(data)} items")
        
        if len(data) == 0:
            print_result(False, "Array is empty - engineering.hashnode.com should have posts")
            return False
        
        # Validate structure
        is_valid, message = validate_blog_post_structure(data[0])
        print_result(is_valid, f"Post structure: {message}")
        
        if is_valid:
            print(f"\nFirst post from engineering.hashnode.com:")
            print(f"  - Title: {data[0]['title']}")
            print(f"  - URL: {data[0]['url']}")
        
        return is_valid
        
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

def test_root_endpoint():
    """Test 4: Regression - GET /api/ still works"""
    print_test_header("Regression Check: GET /api/")
    
    try:
        response = requests.get(f"{BASE_URL}/api/", timeout=10)
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
        
        print_result(True, f"Status code: {response.status_code}")
        
        data = response.json()
        
        if "message" not in data:
            print_result(False, "Expected 'message' field in response")
            return False
        
        print_result(True, f"Response: {data}")
        return True
        
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

def test_status_endpoint():
    """Test 5: Regression - GET /api/status still works"""
    print_test_header("Regression Check: GET /api/status")
    
    try:
        response = requests.get(f"{BASE_URL}/api/status", timeout=10)
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
        
        print_result(True, f"Status code: {response.status_code}")
        
        data = response.json()
        
        if not isinstance(data, list):
            print_result(False, f"Expected array, got {type(data)}")
            return False
        
        print_result(True, f"Response is an array with {len(data)} items")
        return True
        
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*80)
    print("BACKEND API TEST SUITE - Portfolio Blog Integration")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Testing /api/blogs endpoint and regression checks")
    
    results = {
        "GET /api/blogs (default)": test_blogs_default(),
        "GET /api/blogs?refresh=true": test_blogs_refresh(),
        "GET /api/blogs?host=custom": test_blogs_custom_host(),
        "GET /api/ (regression)": test_root_endpoint(),
        "GET /api/status (regression)": test_status_endpoint(),
    }
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return 1

if __name__ == "__main__":
    exit(main())
