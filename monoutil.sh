# #!/bin/bash

# # #
# # This script will prompt the user (with whiptail) to select directories in the current directory.
# # The selected directories will be symlinked to a directory prompted by another whiptail prompt.
# # #

# # Define the base directory and the domain
# local_dirs=()
# for d in */ ; do
#     local_dirs+=( "${d%/}" )
# done

# # Prepare an array for the whiptail arguments
# whiptail_args=()

# # Loop over the local_dirs and append each directory as an option
# for dir in "${local_dirs[@]}"; do
#     desc=""
#     if [ -f "$dir/README" ]; then
#         desc+=" $(head -c 50 "$dir/README")"
#     fi
#     whiptail_args+=( "$dir" "$desc" OFF )
# done

# # Display the checklist using whiptail
# selected_dirs=$(whiptail --title "Select Projects" --checklist \
# "Use SPACE to select projects and ENTER to confirm:" 20 70 15 \
# "${whiptail_args[@]}" 3>&1 1>&2 2>&3)

# # Check if the user pressed Cancel
# exit_status=$?
# if [ $exit_status -ne 0 ]; then
#     echo "Selection canceled."
#     exit 1
# fi


#!/bin/bash

# Ask the user for the top-level action (Add or Remove Links)
action=$(whiptail --title "Link Manager" --menu "Choose an action:" 15 60 2 \
"Add" "Add new links" \
"Remove" "Remove links" 3>&1 1>&2 2>&3)

# Exit if the user pressed Cancel.
if [ $? -ne 0 ]; then
    exit 1
fi

# Define the SOURCE_PATH, you can set this to the desired location in your filesystem
SOURCE_PATH="/path/to/source/directories" 

# Ask the user to select the current directory or enter a new one
choice=$(whiptail --title "Directory Selection" --radiolist \
"Choose directory:" 15 60 2 \
"Current" "Use current directory" ON \
"Enter" "Enter a directory" OFF 3>&1 1>&2 2>&3)

# Exit if the user pressed Cancel.
if [ $? -ne 0 ]; then
    exit 1
fi

if [ "$choice" == "Enter" ]; then
    # Prompt the user to enter a target directory path
    target_directory=$(whiptail --title "Input" --inputbox "Enter the target directory path:" 10 60 3>&1 1>&2 2>&3)
    # Exit if Cancel is pressed.
    if [ $? -ne 0 ]; then
        exit 1
    fi
else
    # Use the current directory as the target directory
    target_directory=$(pwd)
fi

SOURCE_PATH="/var/www/0b.lol"
# Proceed with Add or Remove action
case $action in
    Add)
        # Create an array to hold the checklist options
        checklist_options=()

        # Get the list of directories in the SOURCE_PATH
        for dir in "$SOURCE_PATH"/*/ ; do
            dir_name=$(basename "$dir")
            checklist_options+=("$dir_name" "" OFF)
        done

        # Filter out directories that already have a symlink in the target directory
        filtered_checklist_options=()
        for option in "${checklist_options[@]}"; do
            if [ ! -L "$target_directory/${option%% *}" ]; then
                filtered_checklist_options+=("$option")
            fi
        done

        # Prompt user to select directories to link
        selected_dirs=$(whiptail --title "Select Directories to Link" --checklist \
        "Choose directories to create symlinks in $target_directory:" 20 70 10 \
        "${filtered_checklist_options[@]}" 3>&1 1>&2 2>&3)

        # Check if the user pressed Cancel
        if [ $? -ne 0 ]; then
            exit 1
        fi

        # Read the selection into an array
        read -a dirs_to_link <<< $selected_dirs

        # Iterate over the selected directories and create symlinks
        for dir in "${dirs_to_link[@]}"; do
            # if [ ! -L "$target_directory/$dir" ]; then
            echo "Creating symlink for $dir"
            echo "ln -s \"$SOURCE_PATH/$dir\" \"$target_directory/$dir\""
            ln -s "$SOURCE_PATH/$dir" "$target_directory/$dir"
            # fi
        done
        ;;

    Remove)
        # Create an array to hold the checklist options
        checklist_options=()

        # Find symlinks in the current directory pointing to the SOURCE_PATH and add them to the checklist
        for link in "$target_directory"/*; do
            if [ -L "$link" ] && [ "$(readlink -f "$link")" == "$SOURCE_PATH/"* ]; then
                link_name=$(basename "$link")
                checklist_options+=("$link_name" "" OFF)
            fi
        done

        # Prompt user to select links to remove
        selected_links=$(whiptail --title "Select Links to Remove" --checklist \
        "Choose symlinks to remove from $target_directory:" 20 70 10 \
        "${checklist_options[@]}" 3>&1 1>&2 2>&3)

        # Check if the user pressed Cancel
        if [ $? -ne 0 ]; then
            exit 1
        fi

        # Read the selection into an array
        read -a links_to_remove <<< $selected_links

        # Iterate over the selected links and remove them
        for link in "${links_to_remove[@]}"; do
            rm -f "$target_directory/$link"
        done
        ;;
esac