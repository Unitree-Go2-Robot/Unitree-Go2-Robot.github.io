.. _foxy_computer_build:

Build in your computer
######################

Install ROS 2
*************

Please install ROS 2 Foxy via `deb packages <https://docs.ros.org/en/foxy/Installation/Ubuntu-Install-Debs.html>`_ or build `the binaries <https://docs.ros.org/en/foxy/Installation/Alternatives/Ubuntu-Install-Binary.html>`_.


Build Go2 Robot packages
************************
First we are going to prepare our workspace where we are going to add the necessary packages

.. code-block:: bash

   mkdir -p ~/go2_ws/src
   cd ~/go2_ws/src
   wget -qO- https://raw.githubusercontent.com/Unitree-Go2-Robot/go2_robot/refs/heads/foxy/dependencies.repos | vcs import .

.. note::
 If you have another workspace, or have compiled all ros2, remember to change the workspace names or have multiple active ones.

Installs all the necessary dependencies to build the packages

.. code-block:: bash

   cd ~/go2_ws
   sudo rosdep init
   rosdep update
   rosdep install --from-paths src --ignore-src -r -y

Finally, build the packages

.. code-block:: bash

   colcon build --symlink-install
   source ~/go2_ws/install/setup.bash
