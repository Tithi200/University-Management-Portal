# Excel Column Name Guide

## Supported Column Names

The system is flexible and accepts various column name formats. Here are the supported names for each field:

### Name (Required)
The system will look for columns named:
- `Name`
- `name`
- `NAME`
- `Student Name`
- `StudentName`
- `STUDENT NAME`
- `Full Name`
- `FullName`
- `FULL NAME`
- `Student`
- `STUDENT`
- `student`

**The system is case-insensitive and handles spaces**, so `student name`, `STUDENT NAME`, or `Student Name` will all work.

### Course (Optional)
- `Course`
- `course`
- `COURSE`
- `Course Name`
- `CourseName`
- `COURSE NAME`
- `Program`
- `program`
- `PROGRAM`

### Age (Optional)
- `Age`
- `age`
- `AGE`
- `Age (Years)`
- `Age(Years)`

### Blood Group (Optional)
- `BloodGroup`
- `Blood Group`
- `bloodGroup`
- `blood group`
- `BLOODGROUP`
- `BLOOD GROUP`
- `Blood Type`
- `BloodType`
- `blood type`
- `BLOOD TYPE`

### Parent Name (Optional)
- `ParentName`
- `Parent Name`
- `parentName`
- `parent name`
- `PARENTNAME`
- `PARENT NAME`
- `Guardian Name`
- `GuardianName`
- `guardian name`
- `GUARDIAN NAME`

### Parent Phone (Optional)
- `ParentPhone`
- `Parent Phone`
- `parentPhone`
- `parent phone`
- `PARENTPHONE`
- `PARENT PHONE`
- `Parent Contact`
- `ParentContact`
- `parent contact`
- `PARENT CONTACT`
- `Phone`
- `phone`
- `PHONE`

### Photo (Optional)
- `Photo`
- `photo`
- `PHOTO`
- `Photo URL`
- `PhotoURL`
- `photo url`
- `PHOTO URL`
- `Image`
- `image`
- `IMAGE`

## Tips

1. **Case doesn't matter**: `Name`, `name`, `NAME` all work
2. **Spaces are handled**: `Student Name` and `StudentName` both work
3. **Partial matches**: The system tries to find the best match
4. **First row must be headers**: Make sure your first row contains column names
5. **Only Name is required**: All other columns can be empty or missing

## Example Excel Format

| Name | Course | Age | Blood Group | Parent Name | Parent Phone |
|------|--------|-----|-------------|--------------|--------------|
| John Doe | Computer Science | 20 | A+ | Jane Doe | 9876543210 |
| Jane Smith | Mathematics | 19 | B+ | John Smith | 9876543211 |

## Troubleshooting

If you get "Name is required" error:

1. **Check your column header**: Make sure the first row has a column name that contains "name" or "student"
2. **Check for typos**: Common mistakes: `Nmae`, `Stuent Name`, etc.
3. **Check for extra spaces**: `Name ` (with trailing space) might cause issues
4. **Check the upload response**: After uploading, check the "Detected columns" message to see what columns were found
5. **Check backend console**: The backend logs all available columns when processing

## Debugging

After uploading, the system will show:
- ✅ Success message with number of students imported
- 📋 List of detected columns
- ⚠️ Any errors with row numbers and available columns

Check the browser console (F12) for detailed information about what columns were found.

